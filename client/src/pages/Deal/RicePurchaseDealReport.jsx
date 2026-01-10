"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { setPageIndex, setPageSize } from "@/store/slices/tableSlice";
import TablePagination from "@/components/ui/table-pagination";
import EmptyState from "@/components/EmptyState";
import {
  useRicePurchases,
  useDeleteRicePurchase,
} from "@/hooks/useRicePurchases";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RicePurchaseDealReport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.table);
  const { t } = useTranslation(["reports", "common"]);

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  // Use the useRicePurchases hook to fetch data
  const {
    ricePurchases,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    hasNext,
    hasPrev,
  } = useRicePurchases();

  // Delete mutation
  const deleteDealMutation = useDeleteRicePurchase();

  // Table column definitions
  const columns = [
    {
      accessorKey: "ricePurchaseNumber",
      header: "सौदा नंबर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap text-center">
          {row.getValue("ricePurchaseNumber") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "दिनांक",
      meta: { filterVariant: "date" },
      cell: ({ row }) => {
        const date = row.getValue("date");
        if (!date)
          return <span className="text-muted-foreground text-center">-</span>;
        const formattedDate = format(new Date(date), "dd MMM yyyy");
        return (
          <div className="text-sm whitespace-nowrap text-center">
            {formattedDate}
          </div>
        );
      },
    },
    {
      accessorKey: "partyName",
      header: "पार्टी का नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.getValue("partyName") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "brokerName",
      header: "ब्रोकर का नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.getValue("brokerName") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "delivery",
      header: "डिलीवरी",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("delivery") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "lotOptions",
      header: "LOT/अन्य",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("lotOptions") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "lotNumber",
      header: "LOT क्रमांक",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const lotEntries = row.original.lotEntries;
        const lotNumbers =
          lotEntries?.map((entry) => entry.lotNumber).join(", ") || "-";
        return <div className="text-sm text-center">{lotNumbers}</div>;
      },
    },
    {
      accessorKey: "fciOptions",
      header: "FCI/NAN",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("fciOptions") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "riceType",
      header: "चावल का प्रकार",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("riceType") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "मात्रा (क्विंटल)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity");
        return quantity ? (
          <div className="text-sm font-medium text-center">{quantity}</div>
        ) : (
          <span className="text-muted-foreground text-center">-</span>
        );
      },
    },
    {
      accessorKey: "rate",
      header: "चावल का भाव/दर (प्रति क्विंटल)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const rate = row.getValue("rate");
        return rate ? (
          <div className="text-sm font-medium text-center">&#8377;{rate}</div>
        ) : (
          <span className="text-muted-foreground text-center">-</span>
        );
      },
    },
    {
      accessorKey: "wastagePercent",
      header: "बटाव (%)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("wastagePercent") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "brokerage",
      header: "दलाली",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("brokerage") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "gunnyOptions",
      header: "बारदाना सहित/वापसी",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("gunnyOptions") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "newGunnyRate",
      header: "नया बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("newGunnyRate") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "oldGunnyRate",
      header: "पुराना बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("oldGunnyRate") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "plasticGunnyRate",
      header: "प्लास्टिक बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center">
          {row.getValue("plasticGunnyRate") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "frkOptions",
      header: "FRK",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm text-center whitespace-nowrap">
          {row.getValue("frkOptions") || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const deal = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(deal)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                {t("common:view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(deal)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("common:edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(deal)}
                className="text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                {t("common:delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleView = (deal) => {
    setSelectedDeal(deal);
    setIsDrawerOpen(true);
  };

  const handleEdit = (deal) => {
    navigate("/purchase/rice", { state: { deal, isEditing: true } });
  };

  const handleDelete = (deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!dealToDelete?._id) return;

    try {
      await deleteDealMutation.mutateAsync(dealToDelete._id);
      toast.success("Rice purchase deal deleted", {
        description: `Deal ${dealToDelete.ricePurchaseNumber} has been successfully deleted.`,
      });
    } catch (error) {
      toast.error("Failed to delete deal", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
        <div className="flex flex-col items-center gap-3">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Loading rice purchase deals...
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no rice deals
  if (!isLoading && ricePurchases.length === 0) {
    return (
      <EmptyState
        title="आपने अभी तक कोई चावल खरीदी सौदा नहीं जोड़ा है!"
        description="नया चावल खरीदी सौदा जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
        buttonText="चावल खरीदी सौदा जोड़ें"
        addRoute="/purchase/rice"
        icon={ShoppingBagIcon}
      />
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Card className={"py-0"}>
        <CardContent className="p-6 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <DataTable
              columns={columns}
              data={ricePurchases}
              // showFilters={true}
            />
          </div>

          <TablePagination
            pageIndex={pageIndex}
            pageCount={totalPages}
            pageSize={pageSize}
            setPageIndex={(index) => dispatch(setPageIndex(index))}
            setPageSize={(size) => dispatch(setPageSize(size))}
            canPreviousPage={hasPrev}
            canNextPage={hasNext}
            previousPage={() =>
              dispatch(setPageIndex(Math.max(0, pageIndex - 1)))
            }
            nextPage={() => dispatch(setPageIndex(pageIndex + 1))}
            paginationItemsToDisplay={5}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete deal{" "}
              <span className="font-semibold text-foreground">
                {dealToDelete?.ricePurchaseNumber}
              </span>{" "}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDealMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Deal Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Rice Purchase Deal Details
              </h2>
              <p className="text-sm text-muted-foreground">
                View detailed information
              </p>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </DrawerClose>
          </div>

          {selectedDeal && (
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {/* Deal Number Card */}
              <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      Deal Number
                    </p>
                    <p className="text-base font-semibold text-foreground truncate">
                      {selectedDeal.ricePurchaseNumber || (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                      "bg-blue-500/10 text-blue-600"
                    )}
                  >
                    {selectedDeal.lotOptions || "N/A"}
                  </span>
                </div>
              </div>

              {/* Details Card */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Deal Information
                  </h3>
                </div>
                <div className="divide-y divide-border/30">
                  {/* Date */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Date
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.date
                          ? new Date(selectedDeal.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Party Name */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Party
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.partyName || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Broker */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Broker
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.brokerName || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Rice Type */}
                  {selectedDeal.riceType && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <ShoppingBagIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Rice Type
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedDeal.riceType}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                      <BanknotesIcon className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Quantity
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.quantity || "0"} Quintal
                      </p>
                    </div>
                  </div>

                  {/* Rate */}
                  {selectedDeal.rate && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                        <span className="text-lg font-bold text-green-600">
                          ₹
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Rate/Quintal
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          ₹{selectedDeal.rate}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Wastage */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-red-500/20 to-red-500/5 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-600">%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Wastage %
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.wastagePercent || "0"}%
                      </p>
                    </div>
                  </div>

                  {/* Brokerage */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-600">
                        Br
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Brokerage
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        ₹{selectedDeal.brokerage || "0"}/Quintal
                      </p>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center">
                      <span className="text-sm font-bold text-indigo-600">
                        D
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Delivery
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.delivery || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
