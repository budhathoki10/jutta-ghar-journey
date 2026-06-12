import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { createShoe } from '../../api/shoeApi';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { parseSizesInput } from '../../lib/utils';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

type Gender = 'male' | 'female' | 'unisex';
type UploadItem = { url?: string; publicId?: string; progress: number; name?: string };

type ShoeForm = {
  name: string;
  gender: Gender;
  subcategory: string;
  brand: string;
  branded: boolean;
  description: string;
  sizes: string;
  uploads: UploadItem[];
};

const SUBCATS: Record<Gender, string[]> = {
  male: ['Slippers', 'Boots', 'Shoes', 'Branded'],
  female: ['Doctor Chappal', 'Slippers', 'Sport Shoes', 'Branded', 'Boots', 'Hills', 'Close Shoes'],
  unisex: ['Branded Shoes'],
};

const emptyForm = (): ShoeForm => ({
  name: '',
  gender: 'male',
  subcategory: SUBCATS.male[0],
  brand: '',
  branded: false,
  description: '',
  sizes: '',
  uploads: [],
});

const isBrandedSubcategory = (subcategory: string) =>
  subcategory.toLowerCase().includes('branded');

const inputClass =
  'w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10';

const AddShoe: React.FC = () => {
  const [forms, setForms] = useState<ShoeForm[]>([emptyForm()]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { admin, authLoading } = useContext(AuthContext);

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

  const addProduct = () => {
    setForms((items) => {
      const next = [...items, emptyForm()];
      setExpandedIndex(next.length - 1);
      return next;
    });
  };

  const removeProduct = (index: number) => {
    setForms((items) => {
      const next = items.filter((_, idx) => idx !== index);
      setExpandedIndex((current) => {
        if (next.length === 0) return 0;
        if (index === current) return Math.max(0, current - 1);
        if (index < current) return current - 1;
        return current;
      });
      return next.length ? next : [emptyForm()];
    });
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
            brand: isBrandedSubcategory(form.subcategory) ? form.brand.trim() : '',
            branded: isBrandedSubcategory(form.subcategory),
            description: form.description.trim(),
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

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Restoring admin session...
      </main>
    );
  }

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        Please log in to access the admin dashboard.
      </div>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={submit} className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="overflow-hidden rounded-sm border border-border bg-card shadow-card">
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Admin inventory
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Add professional product listings
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Upload clear shoe photos, add brand details for branded pairs, size range, and publish products
                that customers can view with a clean gallery.
              </p>
            </div>

            <div className="rounded-sm border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Batch</p>
              <p className="mt-2 font-serif text-4xl font-black text-ink">{forms.length}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Every product must have at least one uploaded image.
              </p>
            </div>
          </div>
        </section>

        {forms.map((form, formIndex) => {
          const isExpanded = formIndex === expandedIndex;
          const isBrandedProduct = isBrandedSubcategory(form.subcategory);

          return (
            <section key={formIndex} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-sm border border-border bg-card p-4 shadow-card sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <button
                  type="button"
                  onClick={() => setExpandedIndex(formIndex)}
                  className="text-left"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Product {formIndex + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-ink">Product details</h2>
                </button>

                {forms.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-border"
                    onClick={() => removeProduct(formIndex)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>

              {!isExpanded && (
                <button
                  type="button"
                  className="mt-5 w-full rounded-sm border border-border bg-background p-5 text-left text-foreground transition hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => setExpandedIndex(formIndex)}
                >
                  <p className="text-sm font-semibold text-ink">Product summary</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</p>
                      <p className="mt-1 font-medium">{form.name || `Product ${formIndex + 1}`}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Group</p>
                      <p className="mt-1 capitalize">{form.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subcategory</p>
                      <p className="mt-1">{form.subcategory}</p>
                    </div>
                    {isBrandedProduct && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Brand</p>
                        <p className="mt-1">{form.brand || 'Not set'}</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Click anywhere here to open and edit this product.</p>
                </button>
              )}

              <div className={isExpanded ? 'mt-6 grid gap-5 md:grid-cols-2' : 'hidden'}>
                    <label className="space-y-2 md:col-span-2">
                      <span className="text-sm font-semibold text-ink">Product name</span>
                      <input
                        className={inputClass}
                        value={form.name}
                        onChange={(e) => updateForm(formIndex, 'name', e.target.value)}
                        placeholder="e.g. Classic Leather Sandal"
                        required
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink">Customer group</span>
                      <select
                        className={inputClass}
                        value={form.gender}
                        onChange={(e) => {
                          const selected = e.target.value as Gender;
                          const selectedSubcategory = SUBCATS[selected][0];
                          updateForm(formIndex, 'gender', selected);
                          updateForm(formIndex, 'subcategory', selectedSubcategory);
                          updateForm(formIndex, 'branded', isBrandedSubcategory(selectedSubcategory));
                          if (!isBrandedSubcategory(selectedSubcategory)) {
                            updateForm(formIndex, 'brand', '');
                          }
                        }}
                      >
                        <option value="male">Men</option>
                        <option value="female">Women</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-ink">Subcategory</span>
                      <select
                        className={inputClass}
                        value={form.subcategory}
                        onChange={(e) => {
                          const selectedSubcategory = e.target.value;
                          const nextBranded = isBrandedSubcategory(selectedSubcategory);
                          updateForm(formIndex, 'subcategory', selectedSubcategory);
                          updateForm(formIndex, 'branded', nextBranded);
                          if (!nextBranded) {
                            updateForm(formIndex, 'brand', '');
                          }
                        }}
                      >
                        {SUBCATS[form.gender].map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>

                    {isBrandedProduct && (
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-ink">Brand</span>
                        <input
                          className={inputClass}
                          value={form.brand}
                          onChange={(e) => updateForm(formIndex, 'brand', e.target.value)}
                          placeholder="e.g. Nike, Goldstar"
                        />
                      </label>
                    )}

                    <label className="space-y-2 md:col-span-2">
                      <span className="text-sm font-semibold text-ink">Sizes</span>
                      <input
                        className={inputClass}
                        value={form.sizes}
                        onChange={(e) => updateForm(formIndex, 'sizes', e.target.value)}
                        placeholder="Example: 38, 39, 40, 41"
                      />
                    </label>

                    <label className="space-y-2 md:col-span-2">
                      <span className="text-sm font-semibold text-ink">Description</span>
                      <textarea
                        className={`${inputClass} min-h-32 resize-y`}
                        value={form.description}
                        onChange={(e) => updateForm(formIndex, 'description', e.target.value)}
                        placeholder="Write comfort, material, use case, and selling points."
                      />
                    </label>

                  </div>
                </div>

                  <aside className={isExpanded ? 'rounded-sm border border-border bg-card p-4 shadow-card sm:p-6 xl:sticky xl:top-24 xl:self-start' : 'hidden'}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-ink">Product images</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload multiple photos. First image becomes the main image.
                  </p>
                </div>
                <ImagePlus className="h-6 w-6 text-primary" />
              </div>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-border bg-background px-6 py-9 text-center transition hover:border-primary hover:bg-card">
                <ImagePlus className="h-8 w-8 text-primary" />
                <span className="mt-3 text-sm font-semibold text-ink">
                  Click to upload images
                </span>
                <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP accepted</span>
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
                  <p className="rounded-sm border border-mustard/20 bg-mustard/10 px-4 py-3 text-sm text-ink">
                    No images uploaded yet.
                  </p>
                )}

                {form.uploads.map((upload, imageIndex) => (
                  <div
                    key={`${upload.name}-${imageIndex}`}
                    className="flex gap-3 rounded-sm border border-border bg-background p-3"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-sm bg-secondary/40">
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
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {upload.name || `Image ${imageIndex + 1}`}
                      </p>

                      {upload.progress >= 0 && upload.progress < 100 && (
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
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
                      className="rounded-full p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </aside>
          </section>
          );
        })}

        <div className="flex flex-col-reverse gap-3 rounded-sm border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-border"
            onClick={addProduct}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add another product
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-terracotta-deep"
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
    </AdminLayout>
  );
};

export default AddShoe;
