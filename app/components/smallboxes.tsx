import { LucideIcon } from "lucide-react";

interface SmallBoxesProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string; // extra styles for the icon
  number?: string;
}

export default function SmallBoxes({
  icon: Icon,
  title,
  description,
  iconClassName = "",
  number,
}: SmallBoxesProps) {
  return (
    <div
      className="border p-4 rounded-lg shadow-md transition-all duration-300 
                    hover:shadow-xl hover:-translate-y-1
                    group-hover:blur-xs hover:!blur-none"
    >
      <h1 className="absolute text-8xl font-bold text-gray-100 translate-x-38">
        {number}
      </h1>
      <Icon className={`p-2 rounded-md scale-90 ${iconClassName}`} size={40} />
      <h3 className="font-bold">{title}</h3>
      <p className="text-xs font-medium text-gray-700">{description}</p>
    </div>
  );
}
