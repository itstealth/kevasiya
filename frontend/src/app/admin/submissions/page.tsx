"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Trash2,
  Mail,
  Phone,
  User,
  Package,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  Eye,
  Inbox,
  Download,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiUrl, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Submission {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string;
  product_details: string | null;
  message: string | null;
  occasion: string | null;
  num_gifts: number | null;
  budget: string | null;
  submitted_at: string;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600 break-words">{value}</p>
      </div>
    </div>
  );
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [field, setField] = useState<string>("all");
  const [occasion, setOccasion] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [minHampers, setMinHampers] = useState<string>("");
  const [maxHampers, setMaxHampers] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = getApiUrl();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    // Keep existing backend capability: only "search" is supported server-side.
    if (search && field === "all") queryParams.append("search", search);

    try {
      const res = await fetch(
        `${apiUrl}/contact-submissions?${queryParams.toString()}`
      );
      if (res.ok) {
        const data: Submission[] = await res.json();
        setSubmissions(data);
        if (data.length > 0) {
          setSelectedSubmission((prev) =>
            prev && data.some((d) => d.id === prev.id) ? prev : data[0]
          );
        } else {
          setSelectedSubmission(null);
        }
      } else {
        console.error("Failed to fetch submissions");
        toast.error("Could not fetch submissions.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching submissions.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, search, field]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchData]);

  // Client-side advanced filtering
  const filteredSubmissions = useMemo(() => {
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo).getTime() : null;

    const text = search.trim().toLowerCase();
    const minH = minHampers ? Number(minHampers) : null;
    const maxH = maxHampers ? Number(maxHampers) : null;

    return submissions.filter((s) => {
      // Date range
      const t = new Date(s.submitted_at).getTime();
      if (fromTs && t < fromTs) return false;
      if (toTs && t > toTs + 24 * 60 * 60 * 1000 - 1) return false;

      // Hampers range
      const hampers = s.num_gifts ?? null;
      if (minH !== null && minH !== undefined && minH !== null) {
        if (hampers === null || hampers < minH) return false;
      }
      if (maxH !== null && maxH !== undefined && maxH !== null) {
        if (hampers === null || hampers > maxH) return false;
      }

      // Occasion filter (acts like "category")
      if (
        occasion !== "all" &&
        (s.occasion || "").toLowerCase() !== occasion.toLowerCase()
      )
        return false;

      // Field-based text search
      if (!text) return true;

      const fullName = `${s.first_name || ""} ${s.last_name || ""}`
        .trim()
        .toLowerCase();
      const email = (s.email || "").toLowerCase();
      const phone = (s.phone || "").toLowerCase();
      const occ = (s.occasion || "").toLowerCase();
      const bud = (s.budget || "").toLowerCase();
      const msg = (s.message || "").toLowerCase();
      const det = (s.product_details || "").toLowerCase();

      const map: Record<string, string> = {
        name: fullName,
        email,
        phone,
        occasion: occ,
        budget: bud,
        message: msg,
        details: det,
        all: [fullName, email, phone, occ, bud, msg, det]
          .filter(Boolean)
          .join(" "),
      };

      const value = field in map ? map[field] : map["all"];
      return value?.includes(text);
    });
  }, [
    submissions,
    search,
    field,
    occasion,
    dateFrom,
    dateTo,
    minHampers,
    maxHampers,
  ]);

  const occasionsList = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => s.occasion && set.add(s.occasion));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [submissions]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredSubmissions.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.info("Select at least one submission to delete.");
      return;
    }
    if (!confirm(`Delete ${selectedIds.size} selected submission(s)?`)) return;

    const ids = Array.from(selectedIds);
    let success = 0;
    for (const id of ids) {
      try {
        const res = await fetch(`${apiUrl}/contact-submissions/${id}`, {
          method: "DELETE",
        });
        if (res.ok) success += 1;
      } catch {
        // ignore
      }
    }
    toast.success(`Deleted ${success}/${ids.length} selected.`);
    setSelectedIds(new Set());
    fetchData();
  };

  const exportToExcel = (rows: Submission[], fileName = "submissions.xlsx") => {
    if (rows.length === 0) {
      toast.info("No records to export.");
      return;
    }
    const data = rows.map((s) => ({
      ID: s.id,
      Name: `${s.first_name} ${s.last_name || ""}`.trim(),
      Email: s.email || "",
      Phone: s.phone || "",
      Occasion: s.occasion || "",
      "No. of Gifts": s.num_gifts ?? "",
      Budget: s.budget || "",
      "Product Details": s.product_details || "",
      Message: s.message || "",
      "Submitted At": new Date(s.submitted_at).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");
    XLSX.writeFile(wb, fileName);
  };

  const handleExportSelected = () => {
    const rows = filteredSubmissions.filter((s) => selectedIds.has(s.id));
    exportToExcel(rows, "submissions_selected.xlsx");
  };
  const handleExportFiltered = () => {
    exportToExcel(filteredSubmissions, "submissions_filtered.xlsx");
  };
  const handleExportAll = () => {
    exportToExcel(submissions, "submissions_all.xlsx");
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Review, filter, export and manage inquiries.
          </p>
        </div>

        {/* Filters + Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filters</CardTitle>
            <CardDescription>
              Refine results. Filters run client-side.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Field</label>
              <Select value={field} onValueChange={setField}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Search field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All fields</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="occasion">Occasion</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="details">Product details</SelectItem>
                  <SelectItem value="message">Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Category (Occasion)</label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All occasions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {occasionsList.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date from</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date to</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Hampers (min)</label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 10"
                value={minHampers}
                onChange={(e) => setMinHampers(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Hampers (max)</label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 100"
                value={maxHampers}
                onChange={(e) => setMaxHampers(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-between">
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredSubmissions.length}</strong> of{" "}
              <strong>{submissions.length}</strong>
            </div>
            <div className="flex flex- gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setField("all");
                  setOccasion("all");
                  setDateFrom("");
                  setDateTo("");
                  setMinHampers("");
                  setMaxHampers("");
                }}
              >
                Reset
              </Button>

              <Button variant="outline" onClick={handleExportAll}>
                <Download className="h-4 w-4 mr-2" /> Export All
              </Button>
              <Button variant="outline" onClick={handleExportFiltered}>
                <Download className="h-4 w-4 mr-2" /> Export Filtered
              </Button>
              <Button onClick={handleExportSelected}>
                <Download className="h-4 w-4 mr-2" /> Export Selected
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Leads</CardTitle>
            <CardDescription>Multi-select, export, and delete.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]">
                    <button
                      aria-label="Select all"
                      className="flex items-center justify-center rounded border w-5 h-5 bg-background"
                      onClick={() =>
                        toggleSelectAll(
                          selectedIds.size !== filteredSubmissions.length
                        )
                      }
                    >
                      {selectedIds.size === filteredSubmissions.length &&
                      filteredSubmissions.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden xl:table-cell">Phone</TableHead>
                  <TableHead>Occasion</TableHead>
                  <TableHead className="hidden xl:table-cell">Budget</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="w-[44px]">
                        <Skeleton className="h-5 w-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub) => (
                    <TableRow
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setDetailsOpen(true);
                      }}
                      className={cn(
                        "cursor-pointer",
                        selectedSubmission?.id === sub.id &&
                          "bg-muted hover:bg-muted"
                      )}
                    >
                      <TableCell
                        className="w-[44px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-primary cursor-pointer"
                          checked={selectedIds.has(sub.id)}
                          onChange={(e) =>
                            toggleSelectOne(sub.id, e.target.checked)
                          }
                          aria-label={`Select submission ${sub.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {sub.first_name} {sub.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground lg:hidden">
                          {sub.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {sub.email}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {sub.phone}
                      </TableCell>
                      <TableCell>{sub.occasion || "-"}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {sub.budget || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setDetailsOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={async () => {
                                if (!confirm("Delete this submission?")) return;
                                const res = await fetch(
                                  `${apiUrl}/contact-submissions/${sub.id}`,
                                  { method: "DELETE" }
                                );
                                if (res.ok) {
                                  toast.success("Submission deleted");
                                  setSelectedIds((prev) => {
                                    const n = new Set(prev);
                                    n.delete(sub.id);
                                    return n;
                                  });
                                  fetchData();
                                } else {
                                  toast.error("Failed to delete submission");
                                }
                              }}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-48 text-center text-muted-foreground"
                    >
                      <Inbox className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">No submissions</h3>
                      <p>New contact form submissions will appear here.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {selectedIds.size > 0 ? (
                <span>
                  <strong>{selectedIds.size}</strong> selected
                </span>
              ) : (
                <span>Select rows to enable bulk actions</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                disabled={selectedIds.size === 0}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            {!selectedSubmission && (
              <DialogDescription>
                Select a submission to see its details.
              </DialogDescription>
            )}
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <InfoRow
                icon={<User size={16} />}
                label="Full Name"
                value={`${selectedSubmission.first_name} ${
                  selectedSubmission.last_name || ""
                }`}
              />
              <InfoRow
                icon={<Mail size={16} />}
                label="Email"
                value={selectedSubmission.email}
              />
              <InfoRow
                icon={<Phone size={16} />}
                label="Phone"
                value={selectedSubmission.phone}
              />
              <InfoRow
                icon={<Package size={16} />}
                label="Occasion"
                value={selectedSubmission.occasion}
              />
              <InfoRow
                icon={<Package size={16} />}
                label="No. of Hampers/Gifts"
                value={
                  selectedSubmission.num_gifts !== null &&
                  selectedSubmission.num_gifts !== undefined
                    ? String(selectedSubmission.num_gifts)
                    : null
                }
              />
              <InfoRow
                icon={<Package size={16} />}
                label="Budget"
                value={selectedSubmission.budget}
              />
              <InfoRow
                icon={<Calendar size={16} />}
                label="Received On"
                value={new Date(
                  selectedSubmission.submitted_at
                ).toLocaleString()}
              />
              <InfoRow
                icon={<Package size={16} />}
                label="Product Details"
                value={selectedSubmission.product_details}
              />
              <InfoRow
                icon={<MessageSquare size={16} />}
                label="Additional Information"
                value={selectedSubmission.message}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
