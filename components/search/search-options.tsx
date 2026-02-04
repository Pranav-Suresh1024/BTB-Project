"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { SearchOptions } from "@/lib/search-types"

interface SearchOptionsProps {
  options: SearchOptions
  onChange: (options: SearchOptions) => void
}

export function SearchOptionsPanel({ options, onChange }: SearchOptionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Checkbox
          id="includeDeleted"
          checked={options.includeDeleted}
          onCheckedChange={(checked) =>
            onChange({ ...options, includeDeleted: checked === true })
          }
        />
        <Label htmlFor="includeDeleted" className="text-sm font-normal cursor-pointer">
          Include deleted files
        </Label>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox
          id="includeRenamed"
          checked={options.includeRenamed}
          onCheckedChange={(checked) =>
            onChange({ ...options, includeRenamed: checked === true })
          }
        />
        <Label htmlFor="includeRenamed" className="text-sm font-normal cursor-pointer">
          Include renamed files
        </Label>
      </div>
    </div>
  )
}
