"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { MoreHorizontal, PlusCircle, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiUrl } from "@/lib/utils";
import { Product, Category, SubCategory } from "@/types/product";
import { revalidateProducts } from "@/app/actions";

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  included_items: string[] | null;
  packaging: string | null;
  image: string;
  images: string[] | null;
  category_id: number;
  category_name: string;
  subcategory_id: number | null;
  subcategory_name: string | null;
  // Add new fields from API
  tags: string[];
  MOQ: number | null;
  isFeatured: boolean;
  sales: string | null;
}

// --- Reusable Dialog for Add/Edit Product ---
function ProductDialog({
  product,
  open,
  onOpenChange,
  onSave,
  categories,
  subCategories,
}: {
  product?: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  categories: Category[];
  subCategories: SubCategory[];
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [packaging, setPackaging] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(
    undefined
  );
  const [includedItems, setIncludedItems] = useState("");

  // New optional fields
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [moq, setMoq] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sales, setSales] = useState("");

  // State for new files
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // State for existing images (when editing)
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<
    string | null
  >(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  // const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  // State for new image previews
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const filteredSubcategories = subCategories.filter(
    (sub) => sub.category_id.toString() === categoryId
  );

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price);
      setPackaging(product.packaging || "");
      setCategoryId(product.category.id.toString());
      setSubCategoryId(product.subcategory?.id.toString());
      setIncludedItems((product.included_items || []).join("\n"));

      // Separate existing images for the UI
      setExistingMainImageUrl(product.image || null);
      setExistingGalleryUrls(product.images || []);

      // Set new optional fields
      setTags(product.tags || []);
      setMoq(product.MOQ?.toString() || "");
      setIsFeatured(product.isFeatured || false);
      setSales(product.sales || "");
    } else {
      // Reset for "Add" mode
      setName("");
      setDescription("");
      setPrice("Price on Request");
      setPackaging("");
      setCategoryId(undefined);
      setSubCategoryId(undefined);
      setIncludedItems("");
      setExistingMainImageUrl(null);
      setExistingGalleryUrls([]);

      // Reset new optional fields
      setTags([]);
      setMoq("");
      setIsFeatured(false);
      setSales("");
    }

    // Reset file inputs and previews on open/product change
    setImageFile(null);
    setGalleryFiles([]);
    // setImagesToRemove([]);
    setTagInput(""); // Reset tag input field
    if (mainImageInputRef.current) mainImageInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }, [product, open]);

  // Create/revoke preview URLs for new files
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setImagePreview(null);
  }, [imageFile]);

  useEffect(() => {
    if (galleryFiles.length > 0) {
      const urls = galleryFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
    setGalleryPreviews([]);
  }, [galleryFiles]);

  const handleRemoveExistingMainImage = () => {
    // This now just clears the image from the UI.
    // The backend will handle file deletion if a new image isn't saved.
    setExistingMainImageUrl(null);
  };

  const handleRemoveExistingGalleryImage = (urlToRemove: string) => {
    // setImagesToRemove((prev) => [...prev, urlToRemove]);
    setExistingGalleryUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // Tag management functions
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const existingFileNames = new Set(
      existingGalleryUrls.map((url) => url.split("/").pop())
    );
    const stagedFileNames = new Set(galleryFiles.map((f) => f.name));

    const uniqueNewFiles = newFiles.filter(
      (file) =>
        !stagedFileNames.has(file.name) && !existingFileNames.has(file.name)
    );

    if (uniqueNewFiles.length < newFiles.length) {
      alert("Skipped adding duplicate images (same filename).");
    }

    if (uniqueNewFiles.length > 0) {
      setGalleryFiles((prev) => [...prev, ...uniqueNewFiles]);
    }

    // Reset the file input so the same file can be selected again if removed
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Stricter validation for new products
    if (!product) {
      if (!imageFile) {
        alert("A main image is required to create a new product.");
        return;
      }
      if (!categoryId) {
        alert("A category is required to create a new product.");
        return;
      }
      // if (!subCategoryId) {
      //   alert("A sub-category is required to create a new product.");
      //   return;
      // }
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("packaging", packaging);
    if (categoryId) formData.append("category_id", categoryId);
    if (subCategoryId) formData.append("subcategory_id", subCategoryId);

    const items = includedItems
      .split("\n")
      .filter((line) => line.trim() !== "");
    formData.append("included_items", JSON.stringify(items));

    // Add new optional fields
    formData.append("tags", JSON.stringify(tags));
    if (moq) formData.append("MOQ", moq);
    formData.append("isFeatured", isFeatured.toString());
    if (sales) formData.append("sales", sales);

    if (imageFile) formData.append("image", imageFile);
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    if (product) {
      // Send a clear signal to the backend about which images to keep and remove
      if (existingMainImageUrl) {
        formData.append("existing_main_image", existingMainImageUrl);
      }

      existingGalleryUrls.forEach((url) =>
        formData.append("existing_gallery_images", url)
      );

      // 'images_to_remove' is no longer needed; the backend handles this comparison.
      // imagesToRemove.forEach((url) => formData.append("images_to_remove", url));
    }

    const apiUrl = getApiUrl();
    const url = product
      ? `${apiUrl}/products/${product.id}`
      : `${apiUrl}/products`;
    const method = product ? "PUT" : "POST";

    setIsSaving(true);
    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        await revalidateProducts();
        onSave(); // Triggers the data refresh in the parent
        onOpenChange(false); // Closes the dialog from within
      } else {
        const error = await res.json();
        console.error("Failed to save product:", error);
        alert(`Error: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. 'Welcome Baby' Gift Box"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  // required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A short summary of the product."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="e.g. 2499 or 'Price on Request'"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    // required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="packaging">Packaging</Label>
                  <Input
                    id="packaging"
                    placeholder="e.g. Kevasiya Signature Box"
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select onValueChange={setCategoryId} value={categoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Subcategory</Label>
                  <Select
                    onValueChange={setSubCategoryId}
                    value={subCategoryId}
                    disabled={!categoryId || filteredSubcategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="included-items">Included Items</Label>
                <Textarea
                  id="included-items"
                  placeholder="List each item on a new line."
                  value={includedItems}
                  onChange={(e) => setIncludedItems(e.target.value)}
                  rows={4}
                />
              </div>

              {/* New optional fields */}
              <div className="grid gap-2">
                <Label htmlFor="tags">Product Tags</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Enter a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="group">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 rounded-full bg-white/20 hover:bg-white/40 w-4 h-4 flex items-center justify-center text-xs"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="moq">Minimum Order Quantity</Label>
                  <Input
                    id="moq"
                    type="number"
                    placeholder="e.g. 50"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sales">Sales Information</Label>
                  <Input
                    id="sales"
                    placeholder="e.g. Best Seller"
                    value={sales}
                    onChange={(e) => setSales(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Mark as Featured Product
                  </Label>
                  <Switch
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Product Images</CardTitle>
                  <CardDescription>
                    Upload a main image and optional gallery images.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="main-image">Main Image</Label>
                    <Input
                      id="main-image"
                      ref={mainImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                    {imagePreview && (
                      <div className="relative mt-2 w-fit">
                        <Image
                          src={imagePreview}
                          alt="Main preview"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setImageFile(null);
                            if (mainImageInputRef.current) {
                              mainImageInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {!imagePreview && existingMainImageUrl && (
                      <div className="relative mt-2 w-fit">
                        <Image
                          src={existingMainImageUrl}
                          alt="Current main image"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={handleRemoveExistingMainImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gallery-images">Gallery Images</Label>
                    <Input
                      id="gallery-images"
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFileChange}
                    />
                    {galleryPreviews.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {galleryPreviews.map((url, index) => (
                          <div key={url} className="relative">
                            <Image
                              src={url}
                              alt={`Gallery preview ${index + 1}`}
                              width={100}
                              height={100}
                              className="rounded-md object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={() => {
                                const newFiles = [...galleryFiles];
                                newFiles.splice(index, 1);
                                setGalleryFiles(newFiles);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {existingGalleryUrls.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium">
                          Current Gallery Images
                        </Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[...existingGalleryUrls].reverse().map((url) => (
                            <div key={url} className="relative group">
                              <Image
                                src={url}
                                alt="Existing gallery"
                                width={100}
                                height={100}
                                className="rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  handleRemoveExistingGalleryImage(url)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page Component ---
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<{
    categoryId?: string;
    subcategoryId?: string;
    name?: string;
    isFeatured?: "true" | "false" | "" | "all";
    tag?: string;
    moq?: string;
  }>({});

  const filteredSubcategoriesForFilter = subCategories.filter(
    (sub) => sub.category_id.toString() === filters.categoryId
  );

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const queryParams = new URLSearchParams();
      if (filters.categoryId)
        queryParams.append("category_id", filters.categoryId);
      if (filters.subcategoryId)
        queryParams.append("subcategory_id", filters.subcategoryId);
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.isFeatured && filters.isFeatured !== "all")
        queryParams.append("isFeatured", filters.isFeatured);
      if (filters.tag) queryParams.append("tags", filters.tag);
      if (filters.moq) queryParams.append("moq", filters.moq);

      const [prodRes, catRes, subCatRes] = await Promise.all([
        fetch(`${apiUrl}/products?${queryParams.toString()}`),
        fetch(`${apiUrl}/categories`),
        fetch(`${apiUrl}/subcategories`),
      ]);

      // Check if products request was successful
      if (!prodRes.ok) {
        console.error(
          "Failed to fetch products:",
          prodRes.status,
          prodRes.statusText
        );
        const errorData = await prodRes
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Products API Error:", errorData);
        alert(
          "Failed to fetch products. Please check if the database has been updated with new columns."
        );
        return;
      }

      const productsData: ApiProduct[] = await prodRes.json();

      // Additional safety check
      if (!Array.isArray(productsData)) {
        console.error("Products data is not an array:", productsData);
        alert("Invalid products data received from server.");
        return;
      }

      const slugify = (text: string) =>
        text.toString().toLowerCase().replace(/\s+/g, "-");
      const mappedProducts = productsData.map((p: ApiProduct) => {
        const subcategory =
          p.subcategory_id && p.subcategory_name
            ? {
                id: p.subcategory_id,
                name: p.subcategory_name,
                slug: slugify(p.subcategory_name),
                category_id: p.category_id,
              }
            : null;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          included_items: p.included_items,
          packaging: p.packaging,
          image: p.image,
          images: p.images,
          thumbnail: p.image,
          category: {
            id: p.category_id,
            name: p.category_name,
            slug: slugify(p.category_name || ""),
          },
          subcategory: subcategory,
          category_id: p.category_id,
          subcategory_id: p.subcategory_id ?? undefined,
          // Pass through new fields
          tags: p.tags,
          MOQ: p.MOQ ?? undefined, // Ensure type compatibility
          isFeatured: p.isFeatured,
          sales: p.sales ?? undefined,
        };
      });

      setProducts(mappedProducts);
      setCategories(await catRes.json());
      setSubCategories(await subCatRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = () => {
    // This function no longer closes the dialog. It just handles the post-save logic.
    fetchData();
    setEditingProduct(null);
  };

  const handleFilterChange = (
    type:
      | "categoryId"
      | "subcategoryId"
      | "name"
      | "isFeatured"
      | "tag"
      | "moq",
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [type]: value };
      if (type === "categoryId") {
        delete newFilters.subcategoryId; // Reset subcategory when category changes
      }
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await revalidateProducts();
        fetchData();
      } else {
        const err = await res.json();
        alert(`Error: ${err.details || err.error}`);
      }
    }
  };

  return (
    <>
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        product={editingProduct}
        categories={categories}
        subCategories={subCategories}
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your products and view their sales performance.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setDialogOpen(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="Search by product name..."
              value={filters.name || ""}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="w-full sm:w-[220px]"
            />
            <Input
              placeholder="Search by tag..."
              value={filters.tag || ""}
              onChange={(e) => handleFilterChange("tag", e.target.value)}
              className="w-full sm:w-[150px]"
            />
            <Input
              placeholder="Max MOQ"
              type="number"
              value={filters.moq || ""}
              onChange={(e) => handleFilterChange("moq", e.target.value)}
              className="w-full sm:w-[120px]"
            />
            <Select
              onValueChange={(value) => handleFilterChange("categoryId", value)}
              value={filters.categoryId}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                handleFilterChange("subcategoryId", value)
              }
              value={filters.subcategoryId}
              disabled={
                !filters.categoryId ||
                filteredSubcategoriesForFilter.length === 0
              }
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategoriesForFilter.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id.toString()}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => handleFilterChange("isFeatured", value)}
              value={filters.isFeatured || ""}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Featured</SelectItem>
                <SelectItem value="false">Not Featured</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleResetFilters} variant="outline">
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      {product.thumbnail && (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category?.name || "N/A"}</TableCell>
                    <TableCell>{product.subcategory?.name || "N/A"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProduct(product);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{products.length}</strong> of{" "}
              <strong>{products.length}</strong> products
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
