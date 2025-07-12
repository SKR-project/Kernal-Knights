import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    category?: string;
    condition?: string[];
    size?: string[];
    minPoints?: number;
    maxPoints?: number;
    brand?: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const categories = [
  "men-shirts", "men-pants", "men-shoes", "men-accessories",
  "women-dresses", "women-tops", "women-pants", "women-shoes", "women-accessories",
  "kids-clothing", "kids-shoes",
  "home-decor", "home-textiles"
];

const conditions = ["Like New", "Excellent", "Good", "Fair"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const brands = ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Levi's", "Coach", "Banana Republic"];

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [pointsRange, setPointsRange] = useState([filters.minPoints || 0, filters.maxPoints || 1000]);

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = filters.condition || [];
    const newConditions = checked
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition);
    
    onFiltersChange({ ...filters, condition: newConditions });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const currentSizes = filters.size || [];
    const newSizes = checked
      ? [...currentSizes, size]
      : currentSizes.filter(s => s !== size);
    
    onFiltersChange({ ...filters, size: newSizes });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = filters.brand || [];
    const newBrands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand);
    
    onFiltersChange({ ...filters, brand: newBrands });
  };

  const handlePointsChange = (value: number[]) => {
    setPointsRange(value);
    onFiltersChange({
      ...filters,
      minPoints: value[0],
      maxPoints: value[1]
    });
  };

  const clearFilters = () => {
    setPointsRange([0, 1000]);
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.condition?.length) count += filters.condition.length;
    if (filters.size?.length) count += filters.size.length;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.minPoints || filters.maxPoints) count += 1;
    return count;
  };

  return (
    <div className="w-80 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All <X className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.condition?.map(condition => (
            <Badge key={condition} variant="secondary" className="text-xs">
              {condition}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleConditionChange(condition, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.size?.map(size => (
            <Badge key={size} variant="secondary" className="text-xs">
              Size {size}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleSizeChange(size, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.brand?.map(brand => (
            <Badge key={brand} variant="secondary" className="text-xs">
              {brand}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={() => handleBrandChange(brand, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.category === category}
                onCheckedChange={(checked) => {
                  onFiltersChange({
                    ...filters,
                    category: checked ? category : undefined
                  });
                }}
              />
              <label htmlFor={category} className="text-sm capitalize">
                {category.replace('-', ' ')}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Condition Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {conditions.map(condition => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={filters.condition?.includes(condition) || false}
                onCheckedChange={(checked) => handleConditionChange(condition, !!checked)}
              />
              <label htmlFor={condition} className="text-sm">
                {condition}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Size Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sizes.map(size => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size}
                checked={filters.size?.includes(size) || false}
                onCheckedChange={(checked) => handleSizeChange(size, !!checked)}
              />
              <label htmlFor={size} className="text-sm">
                {size}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brand Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={filters.brand?.includes(brand) || false}
                onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
              />
              <label htmlFor={brand} className="text-sm">
                {brand}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Points Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Points Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={pointsRange}
            onValueChange={handlePointsChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{pointsRange[0]} pts</span>
            <span>{pointsRange[1]} pts</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
