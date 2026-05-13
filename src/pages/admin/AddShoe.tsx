import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShoe } from '../../api/shoeApi';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { parseSizesInput } from '../../lib/utils';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

const SUBCATS: Record<string, string[]> = {
  male: ['Slipper', 'Sports', 'Boots', 'Formal', 'Casual'],
  female: ['Heels', 'Sports', 'Closed-toe', 'Boots', 'Flats', 'Casual'],
  kids: ['Sports', 'Casual', 'School'],
};

type ShoeForm = {
  name: string;
  gender: 'male' | 'female' | 'kids';
  subcategory: string;
  description: string;
  price: string;
  sizes: string;
  files: File[];
  uploads: Array<{ url?: string; publicId?: string; progress: number }>;
};

const getEmptyForm = (): ShoeForm => ({
  name: '',
  gender: 'male',
  subcategory: SUBCATS['male'][0],
  description: '',
  price: '',
  sizes: '',
  files: [],
  uploads: [],
});

const AddShoe: React.FC = () => {
  const [forms, setForms] = useState<ShoeForm[]>([getEmptyForm()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);

  const updateFormField = <K extends keyof ShoeForm>(index: number, field: K, value: ShoeForm[K]) => {
    setForms((prev) => prev.map((form, idx) => (idx === index ? { ...form, [field]: value } : form)));
  };

  const handleFileChange = (formIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    if (!list.length) return;

    setForms((prev) =>
      prev.map((form, idx) =>
        idx === formIndex
          ? { ...form, files: list, uploads: list.map(() => ({ progress: 0 })) }
          : form
      )
    );

    list.forEach((file, idx) => doUpload(formIndex, file, idx));
  };

  const removeImage = (formIndex: number, imageIndex: number) => {
    setForms((prev) =>
      prev.map((form, idx) =>
        idx === formIndex
          ? {
              ...form,
              files: form.files.filter((_, fileIdx) => fileIdx !== imageIndex),
              uploads: form.uploads.filter((_, uploadIdx) => uploadIdx !== imageIndex),
            }
          : form
      )
    );
  };

  const doUpload = async (formIndex: number, file: File, uploadIndex: number) => {
    try {
      const res = await uploadToCloudinary(file, (progress) => {
        setForms((prev) =>
          prev.map((form, idx) => {
            if (idx !== formIndex) return form;
            const updatedUploads = form.uploads.map((upload, uIdx) =>
              uIdx === uploadIndex ? { ...upload, progress } : upload
            );
            return { ...form, uploads: updatedUploads };
          })
        );
      });

      setForms((prev) =>
        prev.map((form, idx) => {
          if (idx !== formIndex) return form;
          const updatedUploads = form.uploads.map((upload, uIdx) =>
            uIdx === uploadIndex ? { ...upload, url: res.url, publicId: res.publicId, progress: 100 } : upload
          );
          return { ...form, uploads: updatedUploads };
        })
      );
    } catch (err) {
      setForms((prev) =>
        prev.map((form, idx) => {
          if (idx !== formIndex) return form;
          const updatedUploads = form.uploads.map((upload, uIdx) =>
            uIdx === uploadIndex ? { ...upload, progress: -1 } : upload
          );
          return { ...form, uploads: updatedUploads };
        })
      );
      console.error('Upload failed', err);
    }
  };

  const addForm = () => {
    setForms((prev) => [...prev, getEmptyForm()]);
  };

  const removeForm = (index: number) => {
    setForms((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalidIndex = forms.findIndex((form) => !form.name.trim());
    if (invalidIndex !== -1) {
      alert(`Please enter a product name for item ${invalidIndex + 1}.`);
      return;
    }

    if (forms.some((form) => !form.uploads.some((upload) => upload.url))) {
      alert('Please upload at least one product image for every item.');
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.all(
        forms.map((form) => {
          const images = form.uploads
            .filter((upload) => upload.url)
            .map((upload) => ({ url: upload.url!, publicId: upload.publicId }));
          const payload = {
            name: form.name.trim(),
            gender: form.gender,
            subcategory: form.subcategory,
            description: form.description.trim(),
            price: form.price ? Number(form.price) : undefined,
            sizes: form.sizes ? parseSizesInput(form.sizes) : [],
            images,
          };
          return createShoe(payload);
        })
      );
      alert('Products added successfully.');
      navigate('/admin/shoes');
    } catch (err) {
      console.error(err);
      alert('Failed to add products. Check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!admin) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-foreground/80">
        <p>Please log in to access the admin dashboard.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin product entry</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Add a new shoe listing</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/80">
          Add a product with polished details and image gallery support. Images are uploaded directly to Cloudinary and attached automatically to the listing.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-8">
        <div className="space-y-6">
          {forms.map((form, formIndex) => (
            <section key={formIndex} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Product {formIndex + 1}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">Add item {formIndex + 1}</h2>
                </div>
                {forms.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-4 py-2 text-sm"
                    onClick={() => removeForm(formIndex)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-foreground">Product name</label>
                    <input
                      value={form.name}
                      onChange={(e) => updateFormField(formIndex, 'name', e.target.value)}
                      placeholder="e.g. Classic Leather Heel"
                      className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => {
                          const selected = e.target.value as 'male' | 'female' | 'kids';
                          updateFormField(formIndex, 'gender', selected);
                          updateFormField(formIndex, 'subcategory', SUBCATS[selected][0]);
                        }}
                        className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="male">Men</option>
                        <option value="female">Women</option>
                        <option value="kids">Kids</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">Subcategory</label>
                      <select
                        value={form.subcategory}
                        onChange={(e) => updateFormField(formIndex, 'subcategory', e.target.value)}
                        className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {SUBCATS[form.gender].map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-foreground">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => updateFormField(formIndex, 'description', e.target.value)}
                      rows={4}
                      placeholder="Short product description"
                      className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">Price</label>
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(e) => updateFormField(formIndex, 'price', e.target.value)}
                        placeholder="e.g. 2499"
                        className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">Available sizes</label>
                      <input
                        value={form.sizes}
                        onChange={(e) => updateFormField(formIndex, 'sizes', e.target.value)}
                        placeholder="38-42 or 38, 39, 40"
                        className="w-full rounded-3xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">Use a range like <span className="font-semibold">39-42</span> or comma-separated values.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Image gallery</p>
                      <h3 className="mt-2 text-xl font-semibold text-ink">Upload photos</h3>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">JPEG / PNG</span>
                  </div>

                  <label className="block rounded-3xl border border-dashed border-border bg-background px-4 py-6 text-center transition hover:border-primary/80 hover:bg-primary/5">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(formIndex, e)}
                    />
                    <div className="space-y-3">
                      <p className="text-lg font-semibold">Choose images</p>
                      <p className="text-sm text-foreground/70">Drag and drop or browse to choose photos for this product.</p>
                    </div>
                  </label>

                  {form.uploads.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {form.uploads.map((upload, index) => (
                        <div key={index} className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm max-w-sm">
                          <div className="relative aspect-square bg-slate-100">
                            {upload.url ? (
                              <img src={upload.url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-sm text-foreground/70">Preparing preview…</div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(formIndex, index)}
                              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="border-t border-border px-4 py-3">
                            <div className="flex items-center justify-between text-sm text-foreground/80">
                              <span>{form.files[index]?.name || `Image ${index + 1}`}</span>
                              <span>{upload.progress === 100 ? 'Done' : upload.progress === -1 ? 'Failed' : `${upload.progress}%`}</span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${upload.progress === -1 ? 'bg-destructive' : 'bg-primary'}`}
                                style={{ width: `${Math.max(0, Math.min(100, upload.progress))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 rounded-3xl border border-border bg-slate-50 p-4 text-sm text-foreground/80">
                    <p className="font-semibold text-foreground">Upload tips</p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Use clear product photos with a neutral background.</li>
                      <li>Upload at least one image so the product appears in listings.</li>
                      <li>Once uploaded, images are stored in Cloudinary and added to the product automatically.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" className="rounded-full px-4 py-3" onClick={addForm}>
            Add another product
          </Button>
        </div>

        <div className="space-y-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <Button type="submit" disabled={isSubmitting} className="w-full rounded-full px-6 py-3">
            {isSubmitting ? 'Saving products…' : 'Save all products'}
          </Button>
          <Button type="button" variant="outline" className="w-full rounded-full px-6 py-3" onClick={() => navigate('/admin/shoes')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddShoe;
