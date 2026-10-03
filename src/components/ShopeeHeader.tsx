import { ChevronLeft, Search, ShoppingCart } from 'lucide-react';

interface ShopeeHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  showCart?: boolean;
}

export function ShopeeHeader({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  showCart = false,
}: ShopeeHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 px-3 py-3 text-white"
      style={{ background: 'linear-gradient(to right, #F53D2D, #FF6633)' }}
    >
      {showBack && (
        <button onClick={onBack} className="shrink-0 -ml-1 p-1 active:opacity-60">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
      )}
      {showSearch ? (
        <div className="flex items-center w-full gap-2">
          <div className="flex-1 flex items-center bg-white rounded-sm px-2 py-1.5">
            <Search size={16} className="text-shopee-text-secondary" />
            <input
              placeholder="Search"
              className="flex-1 ml-1.5 text-sm text-shopee-text-primary outline-none bg-transparent placeholder:text-shopee-text-secondary"
            />
          </div>
          {showCart && (
            <button className="relative p-1">
              <ShoppingCart size={22} />
              <span className="absolute -top-0.5 -right-1 bg-white text-shopee-orange text-[10px] font-bold rounded-full px-1 leading-4">
                3
              </span>
            </button>
          )}
        </div>
      ) : (
        <h1 className="text-base font-semibold truncate flex-1">{title}</h1>
      )}
    </header>
  );
}
