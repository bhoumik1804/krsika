"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setPageIndex, setPageSize } from "@/store/slices/tableSlice";
import TablePagination from "@/components/ui/table-pagination";
import EmptyState from "@/components/EmptyState";
import {
  useSackPurchases,
  useDeleteSackPurchase,
} from "@/hooks/useSackPurchases";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SackPurchaseDealReport() {
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.table);
  const { t } = useTranslation(["reports", "common"]);
  const navigate = useNavigate();

  // Action states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  const deleteSackPurchase = useDeleteSackPurchase();

  const {
    sackPurchases,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    hasNext,
    hasPrev,
  } = useSackPurchases();

  // Handlers
  const handleView = (deal) => {
    setSelectedDeal(deal);
    setIsDrawerOpen(true);
  };

  const handleEdit = (deal) => {
    navigate("/purchase/sack", { state: { deal, isEditing: true } });
  };

  const handleDelete = (deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      deleteSackPurchase.mutate(dealToDelete._id, {
        onSuccess: () => {
          toast.success("Deal Deleted Successfully", {
            description: `Deal ${dealToDelete.sackPurchaseNumber} has been deleted.`,
          });
          setIsDeleteDialogOpen(false);
          setDealToDelete(null);
        },
        onError: (error) => {
          toast.error("Error Deleting Deal", {
            description: error.message,
          });
        },
      });
    }
  };

  const columns = [
    {
      accessorKey: "sackPurchaseNumber",
      header: "सौदा क्रमांक",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium ">
          {row.getValue("sackPurchaseNumber") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "दिनांक",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const date = row.getValue("date");
        if (!date) return <span className="text-muted-foreground">-</span>;
        const formattedDate = new Date(date).toLocaleDateString("hi-IN");
        return <div className="text-sm">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "partyName",
      header: "पार्टी का नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("partyName")}</div>
      ),
    },
    {
      accessorKey: "deliveryOptions",
      header: "डिलीवरी",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">
          {row.getValue("deliveryOptions")}
        </div>
      ),
    },
    {
      accessorKey: "newGunnyCount",
      header: "नया बारदाना संख्या",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("newGunnyCount")}</div>
      ),
    },
    {
      accessorKey: "newGunnyRate",
      header: "नया बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("newGunnyRate")}</div>
      ),
    },
    {
      accessorKey: "oldGunnyCount",
      header: "पुराना बारदाना संख्या",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("oldGunnyCount")}</div>
      ),
    },
    {
      accessorKey: "oldGunnyRate",
      header: "पुराना बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("oldGunnyRate")}</div>
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
        <p className="text-destructive mb-2 font-semibold">
          Error loading sack purchases
        </p>
        <p className="text-muted-foreground text-sm">
          {error?.message || "Something went wrong"}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
        <div className="flex flex-col items-center gap-3">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Loading sack purchase deals...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoading && sackPurchases.length === 0) {
    return (
      <EmptyState
        title="No Sack Purchase Deals Found"
        description="Add a new sack purchase deal to see it here"
        buttonText="Add Sack Purchase"
        addRoute="/purchase/sack"
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
              data={sackPurchases}
              //   showFilters={true}
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
                Sack Purchase Deal Details
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
                      {selectedDeal.sackPurchaseNumber || (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={
                      "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600"
                    }
                  >
                    {selectedDeal.deliveryOptions}
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

                  {/* New Gunny */}
                  {(selectedDeal.newGunnyCount ||
                    selectedDeal.newGunnyRate) && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                        <ShoppingBagIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          New Gunny
                        </p>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {selectedDeal.newGunnyCount || "0"} bags
                          </span>
                          <span className="text-sm font-medium">
                            ₹{selectedDeal.newGunnyRate || "0"}/bag
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Old Gunny */}
                  {(selectedDeal.oldGunnyCount ||
                    selectedDeal.oldGunnyRate) && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <ShoppingBagIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Old Gunny
                        </p>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {selectedDeal.oldGunnyCount || "0"} bags
                          </span>
                          <span className="text-sm font-medium">
                            ₹{selectedDeal.oldGunnyRate || "0"}/bag
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Plastic Gunny */}
                  {(selectedDeal.plasticGunnyCount ||
                    selectedDeal.plasticGunnyRate) && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                        <ShoppingBagIcon className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Plastic Gunny
                        </p>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {selectedDeal.plasticGunnyCount || "0"} bags
                          </span>
                          <span className="text-sm font-medium">
                            ₹{selectedDeal.plasticGunnyRate || "0"}/bag
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sack purchase deal
              <span className="font-semibold text-foreground mx-1">
                {dealToDelete?.sackPurchaseNumber}
              </span>
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
