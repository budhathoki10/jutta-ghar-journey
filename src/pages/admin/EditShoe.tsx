import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShoe, updateShoe } from "@/api/shoeApi";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const CATEGORY_OPTIONS = {
  male: ["Doctor Chappal", "Sports Shoes", "Closed Shoes", "Sandals", "Boots", "Casual", "Formal"],
  female: ["Doctor Chappal", "Sports Shoes", "Closed Shoes", "Sandals", "Heels", "Boots", "Casual"],
};

const EditShoe = () => {
  const { admin } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [shoe, setShoe] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [branded, setBranded] = useState(false);
  const [trending, setTrending] = useState(false);
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Array<{ url?: string; publicId?: string; progress: number }>>([]);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
      return;
    }
    if (!id) return;
    fetchShoe(id)
      .then((res) => {
        const data = res.data;
        setShoe(data);
        setName(data.name || "");
        setGender(data.gender || "male");
        setSubcategory(data.subcategory || "Doctor Chappal");
        setBrand(data.brand || "");
        setBranded(Boolean(data.branded));
        setTrending(Boolean(data.trending));
        setDescription(data.description || "");
        setSizes((data.sizes || []).join(", "));
        setUploads((data.images || []).map((image: any) => ({ url: image.url, publicId: image.publicId, progress: 100 })));
      })
      .catch(console.error);
  }, [admin, id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
    setUploads(list.map(() => ({ progress: 0 })));
    list.forEach((file, idx) => doUpload(file, idx));
  };

  const doUpload = async (file: File, idx: number) => {
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const res = await uploadToCloudinary(file, { cloudName, uploadPreset }, (p) => {
        setUploads((u) => {
          const copy = [...u];
          copy[idx] = { ...copy[idx], progress: p };
          return copy;
        });
      });
      setUploads((u) => {
        const copy = [...u];
        copy[idx] = { ...copy[idx], url: res.url, publicId: res.publicId, progress: 100 };
        return copy;
      });
    } catch (err) {
      setUploads((u) => {
        const copy = [...u];
        copy[idx] = { ...copy[idx], progress: -1 };
        return copy;
      });
      console.error("Upload failed", err);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const images = uploads.filter((u) => u.url).map((u) => ({ url: u.url, publicId: u.publicId }));
    const payload = {
      name,
      gender,
      subcategory,
      brand,
      branded,
      trending,
      description,
      sizes: sizes ? sizes.split(",").map((s) => Number(s.trim())).filter(Boolean) : [],
      images,
    };
    try {
      await updateShoe(id, payload);
      alert("Product updated");
      navigate("/admin/shoes");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!shoe) {
    return <div className="p-8 text-center text-muted-foreground">Loading product details…</div>;
  }

  const categories = CATEGORY_OPTIONS[gender];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Edit product</p>
        <h1 className="mt-3 text-3xl font-black text-ink">Update {shoe.name}</h1>
      </div>
      <form onSubmit={submit} className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className="w-full rounded-3xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" required />
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" className="w-full rounded-3xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full rounded-3xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="male">Men</option>
            <option value="female">Women</option>
          </select>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full rounded-3xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-3 rounded-3xl border border-border bg-background px-4 py-3 text-sm">
            <input type="checkbox" checked={branded} onChange={(e) => setBranded(e.target.checked)} className="h-4 w-4 rounded border-border text-primary accent-primary" />
            Branded product
          </label>
          <label className="flex items-center gap-3 rounded-3xl border border-border bg-background px-4 py-3 text-sm">
            <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} className="h-4 w-4 rounded border-border text-primary accent-primary" />
            Mark as trending
          </label>
          <input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Sizes (36, 37, 38...)" className="w-full rounded-3xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description" rows={5} className="w-full rounded-3xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />

        <div>
          <label className="block text-sm font-semibold text-foreground">Upload additional images</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-3" />
          {uploads.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {uploads.map((upload, index) => (
                <div key={index} className="rounded-3xl border border-border p-3">
                  {upload.url ? <img src={upload.url} alt={`Upload ${index + 1}`} className="h-40 w-full rounded-2xl object-cover" /> : <div className="flex h-40 items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">Preparing image</div>}
                  <div className="mt-3 text-xs text-muted-foreground">
                    {upload.progress === 100 && "Uploaded"}
                    {upload.progress >= 0 && upload.progress < 100 && `Uploading ${upload.progress}%`}
                    {upload.progress === -1 && "Upload failed"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button type="submit" className="rounded-full px-6 py-3">Save Changes</Button>
          <Button type="button" variant="outline" className="rounded-full px-6 py-3" onClick={() => navigate("/admin/shoes")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EditShoe;
