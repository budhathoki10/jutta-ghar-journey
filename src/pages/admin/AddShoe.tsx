import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { createShoe } from '../../api/shoeApi';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { parseSizesInput } from '../../lib/utils';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

type Gender = 'male' | 'female' | 'kids';
type UploadItem = { url?: string; publicId?: string; progress: number; name?: string };

type ShoeForm = {
  name: string;
  gender: Gender;
  subcategory: string;
  brand: string;
  branded: boolean;
  trending: boolean;
  description: string;
  price: string;
  sizes: string;
  uploads: UploadItem[];
};

const SUBCATS: Record<Gender, string[]> = {
  male: ['Doctor Chappal', 'Sports Shoes', 'Closed Shoes', 'Sandals', 'Boots', 'Casual', 'Formal'],
  female: ['Doctor Chappal', 'Sports Shoes', 'Closed Shoes', 'Sandals', 'Heels', 'Boots', 'Casual'],
  kids: ['Sports Shoes', 'School Shoes', 'Sandals', 'Casual'],
};

const emptyForm = (): ShoeForm => ({
  name: '',
  gender: 'male',
  subcategory: SUBCATS.male[0],
  brand: '',
  branded: false,
  trending: false,
  description: '',
  price: '',
  sizes: '',
  uploads: [],
});

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10';

const AddShoe: React.FC = () => {
  const [forms, setForms] = useState<ShoeForm[]>([emptyForm()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);

  const updateForm = <K extends keyof ShoeForm>(
    index: number,
    field: K,
    value: ShoeForm[K]
  ) => {
    setForms((current) =>
      current.map((form, idx) => (idx === index ? { ...form, [field]: value } : form))
    );
  };

  const uploadFile = async (formIndex: number, file: File, uploadIndex: number) => {
    try {
      const result = await uploadToCloudinary(file, (progress) => {
        setForms((current) =>
          current.map((form, idx) => {
            if (idx !== formIndex) return form;
            const uploads = [...form.uploads];
            uploads[uploadIndex] = { ...uploads[uploadIndex], progress };
            return { ...form, uploads };
          })
        );
      });

      setForms((current) =>
        current.map((form, idx) => {
          if (idx !== formIndex) return form;
          const uploads = [...form.uploads];
          uploads[uploadIndex] = {
            ...uploads[uploadIndex],
            ...result,
            progress: 100,
            name: file.name,
          };
          return { ...form, uploads };
        })
      );
    } catch (error) {
      setForms((current) =>
        current.map((form, idx) => {
          if (idx !== formIndex) return form;
          const uploads = [...form.uploads];
          uploads[uploadIndex] = { ...uploads[uploadIndex], progress: -1, name: file.name };
          return { ...form, uploads };
        })
      );
      console.error('Image upload failed', error);
    }
  };

  const handleFiles = (formIndex: number, files: FileList | null) => {
    const selected = files
      ? Array.from(files).filter((file) => file.type.startsWith('image/'))
      : [];

    if (!selected.length) return;

    const startIndex = forms[formIndex].uploads.length;

    setForms((current) =>
      current.map((form, idx) =>
        idx === formIndex
          ? {
              ...form,
              uploads: [
                ...form.uploads,
                ...selected.map((file) => ({ progress: 0, name: file.name })),
              ],
            }
          : form
      )
    );

    selected.forEach((file, index) => uploadFile(formIndex, file, startIndex + index));
  };

  const removeImage = (formIndex: number, imageIndex: number) => {
    setForms((current) =>
      current.map((form, idx) =>
        idx === formIndex
          ? { ...form, uploads: form.uploads.filter((_, uploadIdx) => uploadIdx !== imageIndex) }
          : form
      )
    );
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const invalidProduct = forms.findIndex((form) => !form.name.trim());
    if (invalidProduct >= 0) {
      return alert(`Please enter a product name for product ${invalidProduct + 1}.`);
    }

    const missingImage = forms.findIndex((form) => !form.uploads.some((upload) => upload.url));
    if (missingImage >= 0) {
      return alert(`Please upload at least one image for product ${missingImage + 1}.`);
    }

    setIsSubmitting(true);

    try {
      await Promise.all(
        forms.map((form) =>
          createShoe({
            name: form.name.trim(),
            gender: form.gender,
            subcategory: form.subcategory,
            brand: form.brand.trim(),
            branded: form.branded,
            trending: form.trending,
            description: form.description.trim(),
            price: form.price ? Number(form.price) : undefined,
            sizes: form.sizes ? parseSizesInput(form.sizes) : [],
            images: form.uploads
              .filter((upload) => upload.url)
              .map((upload) => ({
                url: upload.url,
                publicId: upload.publicId,
              })),
          })
        )
      );

      alert('Products added successfully.');
      navigate('/admin/shoes');
    } catch (error) {
      console.error(error);
      alert('Failed to add products. Please check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        Please log in to access the admin dashboard.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-2xl">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.4fr_0.6fr] lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                Admin inventory
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Add professional product listings
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
                Upload clear shoe photos, add pricing, brand, size range, and publish products
                that customers can view with a clean gallery.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-zinc-300">Products in this batch</p>
              <p className="mt-3 text-5xl font-bold">{forms.length}</p>
              <p className="mt-3 text-xs text-zinc-400">
                Every product must have at least one uploaded image.
              </p>
            </div>
          </div>
        </section>

        {forms.map((form, formIndex) => (
          <section key={formIndex} className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Product {formIndex + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Product details</h2>
                </div>

                {forms.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setForms((items) => items.filter((_, idx) => idx !== formIndex))
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-800">Product name</span>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => updateForm(formIndex, 'name', e.target.value)}
                    placeholder="e.g. Classic Leather Sandal"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Customer group</span>
                  <select
                    className={inputClass}
                    value={form.gender}
                    onChange={(e) => {
                      const selected = e.target.value as Gender;
                      updateForm(formIndex, 'gender', selected);
                      updateForm(formIndex, 'subcategory', SUBCATS[selected][0]);
                    }}
                  >
                    <option value="male">Men</option>
                    <option value="female">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Subcategory</span>
                  <select
                    className={inputClass}
                    value={form.subcategory}
                    onChange={(e) => updateForm(formIndex, 'subcategory', e.target.value)}
                  >
                    {SUBCATS[form.gender].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Brand</span>
                  <input
                    className={inputClass}
                    value={form.brand}
                    onChange={(e) => updateForm(formIndex, 'brand', e.target.value)}
                    placeholder="e.g. Nike, Goldstar, Local craft"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-800">Price</span>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => updateForm(formIndex, 'price', e.target.value)}
                    placeholder="e.g. 2500"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-800">Sizes</span>
                  <input
                    className={inputClass}
                    value={form.sizes}
                    onChange={(e) => updateForm(formIndex, 'sizes', e.target.value)}
                    placeholder="Example: 38, 39, 40, 41"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-800">Description</span>
                  <textarea
                    className={`${inputClass} min-h-32 resize-y`}
                    value={form.description}
                    onChange={(e) => updateForm(formIndex, 'description', e.target.value)}
                    placeholder="Write comfort, material, use case, and selling points."
                  />
                </label>

                <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Branded</span>
                      <span className="text-xs text-slate-500">Show as branded product</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={form.branded}
                      onChange={(e) => updateForm(formIndex, 'branded', e.target.checked)}
                      className="h-5 w-5 accent-zinc-950"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Trending</span>
                      <span className="text-xs text-slate-500">Feature on trending list</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={form.trending}
                      onChange={(e) => updateForm(formIndex, 'trending', e.target.checked)}
                      className="h-5 w-5 accent-zinc-950"
                    />
                  </label>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Product images</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload multiple photos. First image becomes the main image.
                  </p>
                </div>
                <ImagePlus className="h-6 w-6 text-slate-400" />
              </div>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-zinc-900 hover:bg-white">
                <ImagePlus className="h-8 w-8 text-slate-400" />
                <span className="mt-3 text-sm font-semibold text-slate-900">
                  Click to upload images
                </span>
                <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP accepted</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(formIndex, e.target.files)}
                />
              </label>

              <div className="mt-5 space-y-3">
                {form.uploads.length === 0 && (
                  <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    No images uploaded yet.
                  </p>
                )}

                {form.uploads.map((upload, imageIndex) => (
                  <div
                    key={`${upload.name}-${imageIndex}`}
                    className="flex gap-3 rounded-2xl border border-slate-200 p-3"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                      {upload.url ? (
                        <img
                          src={upload.url}
                          alt={upload.name || 'Product'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          {upload.progress === -1 ? (
                            <X className="h-5 w-5 text-red-500" />
                          ) : (
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {upload.name || `Image ${imageIndex + 1}`}
                      </p>

                      {upload.progress >= 0 && upload.progress < 100 && (
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-zinc-950 transition-all"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      )}

                      {upload.progress === 100 && (
                        <p className="mt-2 text-xs font-medium text-emerald-600">Uploaded</p>
                      )}

                      {upload.progress === -1 && (
                        <p className="mt-2 text-xs font-medium text-red-600">Upload failed</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(formIndex, imageIndex)}
                      className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        ))}

        <div className="flex flex-col-reverse gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => setForms((items) => [...items, emptyForm()])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add another product
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-zinc-950 px-8 hover:bg-zinc-800"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save products
          </Button>
        </div>
      </form>
    </main>
  );
};

export default AddShoe;