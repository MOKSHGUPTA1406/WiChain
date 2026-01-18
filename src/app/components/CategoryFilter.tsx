import { motion } from "motion/react";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Applets" },
  { id: "AI", label: "AI" },
  { id: "Oracle", label: "Oracle" },
  { id: "Audit", label: "Audit" },
  { id: "Storage", label: "Storage" },
  { id: "DeFi", label: "DeFi" },
  { id: "Compute", label: "Compute" },
];

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selected === category.id;
        return (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }
            `}
          >
            {category.label}
          </motion.button>
        );
      })}
    </div>
  );
}
