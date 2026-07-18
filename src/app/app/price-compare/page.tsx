"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

import { ButtonPrimary } from "@/components/modular/button";
import { PriceCompareHeroSection } from "@/components/price-compare-page/hero";
import { isCompareUrl } from "@/utils/regex";
import { api } from "@/lib/api";

interface ComparisonTable {
  brand_name: string;
  price: string;
  url: string;
}

interface GeminiProductScraper {
  product_image_url: string;
  product_name: string;
  product_price: string;
  comparison_table: ComparisonTable[];
  recommendation_to_buy: boolean;
  lowest_price: string;
  highest_price: string;
}

function PriceComparePage() {
  const [link, setLink] = useState("");
  const [poolingId, setPoolingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [compareResults, setCompareResults] = useState<GeminiProductScraper>();

  const router = useRouter();

  const compareProduct = async () => {
    if (!isCompareUrl(link)) {
      alert("Link not supported.");
      return;
    }

    try {
      setLoading(true);

      const compareRes = await api.post("/api/compare", {
        product_url: link,
      });

      if (compareRes.status === 200) {
        setPoolingId(compareRes.data.pooling_id);
      }
    } catch (e) {
      console.log(
        "Unexpected error occured getting product comparision init as:",
        e,
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!poolingId) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/pooling/${poolingId}`);

        if (res.data.status === "completed") {
          setCompareResults(res.data.data.smart_compare);
          setLoading(false);
          setPoolingId("");
          clearInterval(interval);
        }

        if (res.data.status === "failed") {
          setLoading(false);
          setPoolingId("");
          clearInterval(interval);
          alert("Comparison failed.");
        }
      } catch (e) {
        console.log("Unexpected error occured while polling as:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [poolingId]);

  const resetComparison = () => {
    setCompareResults(undefined);
    setPoolingId("");
    setLoading(false);
    setLink("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-2 p-4 sm:px-16">
      {/* Header */}
      <div className="flex w-full justify-between items-center gap-3">
        <ButtonPrimary
          text="Back"
          icon={ArrowLeft}
          onClick={() => router.back()}
        />

        {compareResults && (
          <ButtonPrimary
            text="Reset"
            icon={RotateCcw}
            onClick={resetComparison}
          />
        )}
      </div>

      {/* Hero */}
      {!loading && !compareResults && (
        <div className="flex flex-1 items-center justify-center">
          <PriceCompareHeroSection
            value={link}
            setValue={setLink}
            search={compareProduct}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-8">
          <Spinner />

          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Comparing Prices
            </h2>

            <p className="max-w-lg text-muted-foreground">
              Searching across supported marketplaces and finding the best deal
              for you...
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && compareResults && (
        <div className="flex flex-col gap-12 mt-6">
          {/* Product Details */}
          <section className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-contrast">
              Product Details
            </h2>

            <div className="flex flex-col gap-8 border border-white/10 bg-background-secondary p-6 md:flex-row md:items-center">
              {/* Image */}
              <div className="flex justify-center md:justify-start">
                <div className="aspect-square w-64 shrink-0 md:w-72">
                  <img
                    src={compareResults.product_image_url}
                    alt={compareResults.product_name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-center gap-6 text-center md:text-left">
                <h1 className="text-3xl font-bold leading-tight text-contrast">
                  {compareResults.product_name}
                </h1>

                <p className="text-4xl font-bold text-accent">
                  {compareResults.product_price}
                </p>

                <div>
                  <span
                    className={`inline-flex px-4 py-2 text-sm font-semibold ${
                      compareResults.recommendation_to_buy
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {compareResults.recommendation_to_buy
                      ? "✓ Recommended to Buy"
                      : "⏳ Wait for Better Price"}
                  </span>
                </div>

                {/* Historical Prices */}
                <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
                      Lowest Ever
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-contrast">
                      {compareResults.lowest_price}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                      Highest Ever
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-contrast">
                      {compareResults.highest_price}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Store Comparison */}
          <section className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-contrast">
              Store Comparison
            </h2>

            <div className="overflow-hidden border border-white/10 bg-background-secondary">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text">
                        Store
                      </th>

                      <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-[0.2em] text-text">
                        Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {compareResults.comparison_table.map((store, index) => (
                      <tr
                        key={`${store.brand_name}-${index}`}
                        className="border-b border-white/10 transition-colors hover:bg-white/[0.03] last:border-none"
                      >
                        <td className="px-6 py-5 font-medium text-contrast">
                          {store.brand_name}
                        </td>

                        <td className="px-6 py-5 text-right text-lg font-semibold text-contrast">
                          {store.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default PriceComparePage;
