// Source: Sera UI (seraui.com)
"use client";
import React, {
  useState,
  useRef,
  useEffect,
} from "react";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M16.5 16.5L21 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="8" fill="#4F46E5" />
    <path
      d="M10 16l4 4 8-8"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    const variants: Record<string, string> = {
      default: "bg-indigo-600 text-white hover:bg-indigo-500",
      ghost: "text-gray-300 hover:text-white hover:bg-white/5",
      outline:
        "border border-white/10 text-gray-300 hover:text-white hover:bg-white/5",
    };
    const sizes: Record<string, string> = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
      icon: "p-2",
    };
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

interface NavigationItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const navigationItems: NavigationItem[] = [
  {
    label: "Products",
    href: "#",
    children: [
      {
        label: "Analytics",
        href: "#analytics",
        description: "Track your data with precision",
      },
      {
        label: "Automation",
        href: "#automation",
        description: "Streamline your workflows",
      },
      {
        label: "Integration",
        href: "#integration",
        description: "Connect your favorite tools",
      },
    ],
  },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
];

const NavigationMenu = ({ items }: { items: NavigationItem[] }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="hidden lg:flex items-center gap-1">
      {items.map((item) => (
        <div key={item.label} className="relative">
          {item.children ? (
            <>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() =>
                  setOpenMenu(openMenu === item.label ? null : item.label)
                }
              >
                {item.label}
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    openMenu === item.label ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openMenu === item.label && (
                <div className="absolute top-full left-0 mt-1 w-64 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl">
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-sm font-medium text-white">
                        {child.label}
                      </div>
                      {child.description && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {child.description}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <a
              href={item.href}
              className="px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {item.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const HeaderComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/80 backdrop-blur-lg border-b border-white/5"
          : "bg-gray-950"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="text-lg font-semibold text-white">Acme</span>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu items={navigationItems} />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:block relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search..."
                    className="w-48"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                >
                  <SearchIcon className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-950 border-t border-white/5">
          <div className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export { HeaderComponent };
export default HeaderComponent;
