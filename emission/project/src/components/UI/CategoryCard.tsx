interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
  onClick: () => void;
}

export default function CategoryCard({ name, description, image, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </button>
  );
}
