"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  TagIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { setPageIndex, setPageSize } from "@/store/slices/tableSlice";
import TablePagination from "@/components/ui/table-pagination";
import EmptyState from "@/components/EmptyState";
import {
  useOtherPurchases,
  useDeleteOtherPurchase,
} from "@/hooks/useOtherPurchases";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function OtherPurchaseDealReport() {
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.table);
  const { t } = useTranslation(["reports", "common"]);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const deleteOtherPurchase = useDeleteOtherPurchase();

  const {
    otherPurchases,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    hasNext,
    hasPrev,
  } = useOtherPurchases();

  const handleView = (deal) => {
    setSelectedDeal(deal);
    setIsDrawerOpen(true);
  };

  const handleEdit = (deal) => {
    navigate("/purchase/other", { state: { deal, isEditing: true } });
  };

  const handleDelete = (deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      deleteOtherPurchase.mutate(dealToDelete._id, {
        onSuccess: () => {
          toast.success("Other Purchase Deleted Successfully", {
            description: `Deal ${dealToDelete.otherPurchaseNumber} has been deleted.`,
          });
          setIsDeleteDialogOpen(false);
          setDealToDelete(null);
        },
        onError: (error) => {
          toast.error("Error deleting deal", {
            description: error.message,
          });
        },
      });
    }
  };

  const columns = [
    {
      accessorKey: "otherPurchaseNumber",
      header: "सौदा क्रमांक",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium ">
          {row.getValue("otherPurchaseNumber") || "-"}
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
      accessorKey: "itemName",
      header: "नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("itemName") || "-"}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "मात्रा",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const qty = row.getValue("quantity");
        const type = row.original.quantityType;
        return (
          <div className="text-sm">
            {qty}{" "}
            {type && <span className="text-sm font-medium ml-1">{type}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "rate",
      header: "दर (₹)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const rate = row.getValue("rate");
        return rate ? (
          <div className="text-sm font-medium">₹{rate}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "gstPercent",
      header: "GST",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const gstPercent = row.getValue("gstPercent");
        return gstPercent ? (
          <div className="text-sm font-medium">{gstPercent}%</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "gstAmount",
      header: "GST की राशी",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const gstAmount = row.getValue("gstAmount");
        return gstAmount ? (
          <div className="text-sm font-medium">₹{gstAmount}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "totalAmountWithGST",
      header: "कुल राशी (WITH GST)",
      cell: ({ row }) => {
        const amount =
          row.original.totalAmountWithGST || row.getValue("totalAmountWithGST");
        return amount ? (
          <div className="text-sm">₹{parseFloat(amount)}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "totalAmountWithGST",
      header: "कुल राशी (WITH GST)",
      cell: ({ row }) => {
        const amount =
          row.original.totalAmountWithGST || row.getValue("totalAmountWithGST");
        return amount ? (
          <div className="text-sm">₹{parseFloat(amount)}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "btavPercent",
      header: "बटाव %",
      cell: ({ row }) => {
        return row.getValue("btavPercent") ? (
          <div className="text-sm">{row.getValue("btavPercent")}%</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "btavAmount",
      header: "बटाव राशी",
      cell: ({ row }) => {
        return row.getValue("btavAmount") ? (
          <div className="text-sm">₹{row.getValue("btavAmount")}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "brokeragePerQuintal",
      header: "दलाली (प्रति क्विंटल)",
      cell: ({ row }) => {
        return row.getValue("brokeragePerQuintal") ? (
          <div className="text-sm">{row.getValue("brokeragePerQuintal")}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "amountPayableToBroker",
      header: "ब्रोकर को भुगतान योग्य राशी",
      cell: ({ row }) => {
        return row.getValue("amountPayableToBroker") ? (
          <div className="text-sm">{row.getValue("amountPayableToBroker")}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "totalAmountPayable",
      header: "कुल भुगतान योग्य राशी",
      cell: ({ row }) => {
        return row.getValue("totalAmountPayable") ? (
          <div className="text-sm">₹{row.getValue("totalAmountPayable")}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
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
          Error loading other purchases
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
            Loading other purchase deals...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoading && otherPurchases.length === 0) {
    return (
      <EmptyState
        title="No Other Purchase Deals Found"
        description="Add a new other purchase deal to see it here"
        buttonText="Add Other Purchase"
        addRoute="/purchase/other"
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
              data={otherPurchases}
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
                Other Purchase Details
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
                      {selectedDeal.otherPurchaseNumber ||
                        selectedDeal.dealNumber || (
                          <span className="text-muted-foreground/50">
                            Not provided
                          </span>
                        )}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBagIcon className="h-4 w-4 text-primary" />
                  </div>
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
                        {selectedDeal.date || selectedDeal.dealDate
                          ? new Date(
                              selectedDeal.date || selectedDeal.dealDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
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

                  {/* Broker Name (Optional) */}
                  {selectedDeal.brokerName && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-teal-500/20 to-teal-500/5 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Broker
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedDeal.brokerName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Item Name */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center">
                      <TagIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Item
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.itemName || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                      <ScaleIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Quantity
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.quantity || "-"}{" "}
                        {selectedDeal.quantityType &&
                          `(${selectedDeal.quantityType})`}
                      </p>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                      <BanknotesIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Rate
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.rate ? `₹${selectedDeal.rate}` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* GST */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center">
                      <ReceiptPercentIcon className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">
                          GST %
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedDeal.gstPercent
                            ? `${selectedDeal.gstPercent}%`
                            : "—"}
                        </p>
                      </div>
                      {selectedDeal.gstAmount && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">
                            GST Amount
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            ₹{selectedDeal.gstAmount}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Discount */}
                  {(selectedDeal.discountPercent ||
                    selectedDeal.discountAmount) && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center">
                        <ReceiptPercentIcon className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                        {selectedDeal.discountPercent && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Discount %
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {selectedDeal.discountPercent}%
                            </p>
                          </div>
                        )}
                        {selectedDeal.discountAmount && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Discount Amount
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              ₹{selectedDeal.discountAmount}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Amount (if available) */}
                  {(selectedDeal.amount || selectedDeal.totalPayable) && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BanknotesIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                        {selectedDeal.amount && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Base Amount
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              ₹{selectedDeal.amount}
                            </p>
                          </div>
                        )}
                        {selectedDeal.totalPayable && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Total Payable
                            </p>
                            <p className="text-sm font-medium text-primary">
                              ₹{selectedDeal.totalPayable}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  {selectedDeal.remarks && (
                    <div className="flex items-start gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-gray-500/20 to-gray-500/5 flex items-center justify-center mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Remarks
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {selectedDeal.remarks}
                        </p>
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
              Other Purchase deal
              <span className="font-semibold text-foreground mx-1">
                {dealToDelete?.otherPurchaseNumber || dealToDelete?.dealNumber}
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
