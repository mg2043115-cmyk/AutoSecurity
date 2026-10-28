/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type CarBody = "SUVs" | "Sedans" | "Esportivos";
type CarFilter = "Todos" | CarBody;
type SearchTarget = "cars" | "products";
type DrawerState = "cart" | "favorites" | null;
type FormStatus = "idle" | "sending" | "success" | "error";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  price: number;
  body: CarBody;
  fuel: string;
  transmission: string;
  image: string;
  imageAlt: string;
  badge: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  previousPrice: number;
  image: string;
  badge: string;
};

type CartLine = { productId: string; quantity: number };

type IconName =
  | "arrow"
  | "arrow-up-right"
  | "bag"
  | "calendar"
  | "car"
  | "check"
  | "chevron"
  | "close"
  | "heart"
  | "location"
  | "mail"
  | "menu"
  | "minus"
  | "plus"
  | "search"
  | "shield"
  | "sparkle"
  | "truck"
  | "user";

const cars: Car[] = [
  {
    id: "audi-s5",
    brand: "Audi",
    model: "S5 Sportback Performance",
    year: 2023,
    kilometers: 14800,
    price: 389900,
    body: "Esportivos",
    fuel: "Gasolina",
    transmission: "Automático",
    image:
      "https://images.pexels.com/photos/7126212/pexels-photo-7126212.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageAlt: "Audi esportivo verde em um ambiente externo",
    badge: "Único dono",
  },
  {
    id: "maserati-ghibli",
    brand: "Maserati",
    model: "Ghibli GT 3.0 V6",
    year: 2022,
    kilometers: 21900,
    price: 489900,
    body: "Sedans",
    fuel: "Gasolina",
    transmission: "Automático",
    image:
      "https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageAlt: "Sedã esportivo preto de luxo em frente a uma casa contemporânea",
    badge: "Seleção motori",
  },
  {
    id: "mercedes-gle",
    brand: "Mercedes-Benz",
    model: "GLE 300d 4MATIC",
    year: 2023,
    kilometers: 18200,
    price: 479900,
    body: "SUVs",
    fuel: "Diesel",
    transmission: "Automático",
    image:
      "https://images.pexels.com/photos/10222084/pexels-photo-10222084.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageAlt: "SUV premium prateado em uma estrada arborizada",
    badge: "Garantia de fábrica",
  },
  {
    id: "porsche-macan",
    brand: "Porsche",
    model: "Macan T PDK",
    year: 2024,
    kilometers: 9300,
    price: 559900,
    body: "SUVs",
    fuel: "Gasolina",
    transmission: "Automático",
    image:
      "https://images.pexels.com/photos/19829080/pexels-photo-19829080.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageAlt: "SUV premium escuro em movimento em uma estrada de outono",
    badge: "Baixa quilometragem",
  },
];

const products: Product[] = [
  {
    id: "detail-pro",
    name: "Kit Detail Pro",
    description: "Acabamento de estúdio, direto na sua garagem.",
    category: "Cuidados",
    price: 389,
    previousPrice: 459,
    image: "/images/product-detailing.jpg",
    badge: "MAIS VENDIDO",
  },
  {
    id: "road-eye-4k",
    name: "Dashcam Road Eye 4K",
    description: "Mais tranquilidade em cada quilômetro.",
    category: "Tecnologia",
    price: 749,
    previousPrice: 899,
    image: "/images/product-dashcam.jpg",
    badge: "NOVIDADE",
  },
  {
    id: "weekender-organizer",
    name: "Organizador Weekender",
    description: "Tudo no lugar. Pronto para qualquer viagem.",
    category: "Viagem",
    price: 299,
    previousPrice: 349,
    image: "/images/product-organizer.jpg",
    badge: "EDIÇÃO ESPECIAL",
  },
];

const catalogues: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  filter: CarBody;
  count: string;
}[] = [
  {
    eyebrow: "GUIA 01 · VIDA EM MOVIMENTO",
    title: "Mais espaço.\nMais histórias.",
    description: "SUVs para ir mais longe, com todo mundo a bordo.",
    image:
      "https://images.pexels.com/photos/19829080/pexels-photo-19829080.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "SUV percorrendo uma estrada arborizada",
    filter: "SUVs",
    count: "02 modelos selecionados",
  },
  {
    eyebrow: "GUIA 02 · SENTIR A ESTRADA",
    title: "Feitos para\nficar na memória.",
    description: "Esportivos que fazem cada curva valer a pena.",
    image:
      "https://images.pexels.com/photos/7126212/pexels-photo-7126212.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "Carro esportivo verde em destaque",
    filter: "Esportivos",
    count: "01 modelo selecionado",
  },
  {
    eyebrow: "GUIA 03 · UM NOVO CLÁSSICO",
    title: "Elegância para\ntodos os caminhos.",
    description: "Sedãs para quem aprecia cada detalhe da viagem.",
    image:
      "https://images.pexels.com/photos/12997736/pexels-photo-12997736.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    imageAlt: "Sedã de luxo fotografado ao anoitecer",
    filter: "Sedans",
    count: "01 modelo selecionado",
  },
];

const iconShapes: Record<IconName, ReactNode> = {
  arrow: <path d="M4.5 12h15m-6-6 6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M7 7h10v10" />,
  bag: (
    <>
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M7.5 3v4M16.5 3v4M3.5 10h17" />
    </>
  ),
  car: (
    <>
      <path d="m4 14 1.4-4.2A2.6 2.6 0 0 1 7.9 8h8.2a2.6 2.6 0 0 1 2.5 1.8L20 14v4H4v-4Z" />
      <path d="M4.5 14h15M7 18v2m10-2v2" />
      <circle cx="7" cy="15.5" r=".8" />
      <circle cx="17" cy="15.5" r=".8" />
    </>
  ),
  check: <path d="m5 12 4.3 4.3L19 6.8" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  heart: <path d="M20.8 8.7c0 5.1-8.8 10-8.8 10S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />,
  location: (
    <>
      <path d="M19 10.3c0 5-7 10.2-7 10.2S5 15.3 5 10.3a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14m-7-7h14" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 21s7-3.4 7-9V5l-7-3-7 3v7c0 5.6 7 9 7 9Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
};

function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconShapes[name]}
    </svg>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatKilometers(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export default function HomeExperience() {
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("cars");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("all");
  const [carFilter, setCarFilter] = useState<CarFilter>("Todos");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [leadInterest, setLeadInterest] = useState<string | null>(null);
  const [leadStatus, setLeadStatus] = useState<FormStatus>("idle");
  const [newsletterStatus, setNewsletterStatus] = useState<FormStatus>("idle");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const savedFavorites: unknown = JSON.parse(localStorage.getItem("motori-favorites") ?? "[]");
      if (Array.isArray(savedFavorites)) {
        setFavorites(
          savedFavorites.filter(
            (id): id is string => typeof id === "string" && cars.some((car) => car.id === id),
          ),
        );
      }

      const savedCart: unknown = JSON.parse(localStorage.getItem("motori-cart") ?? "[]");
      if (Array.isArray(savedCart)) {
        const cleanCart = savedCart.flatMap((entry): CartLine[] => {
          if (typeof entry !== "object" || entry === null) return [];
          const row = entry as { productId?: unknown; quantity?: unknown };
          if (
            typeof row.productId !== "string" ||
            !products.some((product) => product.id === row.productId) ||
            typeof row.quantity !== "number" ||
            !Number.isFinite(row.quantity)
          ) {
            return [];
          }
          return [{ productId: row.productId, quantity: Math.max(1, Math.min(9, Math.floor(row.quantity))) }];
        });
        setCart(cleanCart);
      }
    } catch {
      // A storage antiga ou inválida não deve impedir a página de abrir.
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem("motori-favorites", JSON.stringify(favorites));
    localStorage.setItem("motori-cart", JSON.stringify(cart));
  }, [favorites, cart, hasHydrated]);

  useEffect(() => {
    document.body.style.overflow = drawer || leadInterest ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer, leadInterest]);

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  function announce(message: string) {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3200);
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openLead(interest: string) {
    setDrawer(null);
    setLeadInterest(interest);
    setLeadStatus("idle");
    setMobileMenuOpen(false);
  }

  function closeLead() {
    setLeadInterest(null);
    setLeadStatus("idle");
  }

  function toggleFavorite(carId: string) {
    const alreadySaved = favorites.includes(carId);
    setFavorites((current) =>
      alreadySaved ? current.filter((id) => id !== carId) : [...current, carId],
    );
    announce(alreadySaved ? "Removido da sua garagem." : "Salvo na sua garagem.");
  }

  function addToCart(productId: string) {
    const line = cart.find((item) => item.productId === productId);
    if (line && line.quantity >= 9) {
      announce("Você já adicionou a quantidade máxima deste item.");
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      return existing
        ? current.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { productId, quantity: 1 }];
    });
    const product = products.find((item) => item.id === productId);
    announce(`${product?.name ?? "Produto"} adicionado ao carrinho.`);
  }

  function updateQuantity(productId: string, nextQuantity: number) {
    setCart((current) =>
      nextQuantity <= 0
        ? current.filter((item) => item.productId !== productId)
        : current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(9, nextQuantity) }
              : item,
          ),
    );
  }

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      interest: String(formData.get("interest") ?? ""),
    };

    setLeadStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Não foi possível registrar seu contato.");
      setLeadStatus("success");
      announce("Pedido enviado. Em breve falamos com você!");
    } catch {
      setLeadStatus("error");
    }
  }

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("newsletter-email") ?? "").trim();
    setNewsletterStatus("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Leitor da revista",
          email,
          phone: "",
          interest: "Inscrição na newsletter motori",
        }),
      });
      if (!response.ok) throw new Error("Não foi possível concluir sua inscrição.");
      form.reset();
      setNewsletterEmail("");
      setNewsletterStatus("success");
    } catch {
      setNewsletterStatus("error");
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMobileMenuOpen(false);
    window.setTimeout(() => scrollToSection(searchTarget === "cars" ? "carros" : "produtos"), 50);
  }

  function chooseCatalogue(filter: CarBody) {
    setSearchTarget("cars");
    setSearchTerm("");
    setSearchOption("all");
    setCarFilter(filter);
    scrollToSection("carros");
  }

  const filteredCars = useMemo(() => {
    const query = searchTarget === "cars" ? searchTerm.trim().toLowerCase() : "";
    return cars.filter((car) => {
      const matchesCategory = carFilter === "Todos" || car.body === carFilter;
      const matchesBrand = searchOption === "all" || car.brand === searchOption;
      const searchable = `${car.brand} ${car.model} ${car.year} ${car.body} ${car.fuel}`.toLowerCase();
      return matchesCategory && matchesBrand && (!query || searchable.includes(query));
    });
  }, [carFilter, searchOption, searchTarget, searchTerm]);

  const filteredProducts = useMemo(() => {
    const query = searchTarget === "products" ? searchTerm.trim().toLowerCase() : "";
    return products.filter((product) => {
      const matchesCategory = searchOption === "all" || product.category === searchOption;
      const searchable = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [searchOption, searchTarget, searchTerm]);

  const favoriteCars = cars.filter((car) => favorites.includes(car.id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span><span className="announcement-dot" /> Seu próximo caminho começa com uma boa escolha.</span>
          <a href="#sobre">Conheça a motori <Icon name="arrow-up-right" size={13} /></a>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand-lockup" href="#inicio" aria-label="motori — início">
            <span className="brand-symbol"><Icon name="car" size={20} /></span>
            <span className="brand-word">motori<span>.</span></span>
          </a>

          <nav className={`main-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
            <a href="#carros" onClick={() => setMobileMenuOpen(false)}>Carros</a>
            <a href="#produtos" onClick={() => setMobileMenuOpen(false)}>Acessórios</a>
            <a href="#catalogos" onClick={() => setMobileMenuOpen(false)}>Catálogos</a>
            <a href="#sobre" onClick={() => setMobileMenuOpen(false)}>Nossa curadoria</a>
          </nav>

          <div className="header-actions">
            <button
              className="header-icon-button favorites-trigger"
              type="button"
              onClick={() => setDrawer("favorites")}
              aria-label={`Abrir garagem, ${favorites.length} favoritos`}
            >
              <Icon name="heart" size={19} />
              <span className="header-action-label">Garagem</span>
              <span className="header-count">{favorites.length}</span>
            </button>
            <button
              className="header-icon-button cart-trigger"
              type="button"
              onClick={() => setDrawer("cart")}
              aria-label={`Abrir carrinho, ${cartCount} itens`}
            >
              <Icon name="bag" size={19} />
              <span className="header-count">{cartCount}</span>
            </button>
            <button className="header-sell-button" type="button" onClick={() => openLead("Quero anunciar meu veículo")}>Anunciar veículo <Icon name="arrow-up-right" size={16} /></button>
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
      </header>

      <main id="inicio">
        <section className="hero-section page-container" aria-labelledby="hero-title">
          <div className="hero-card">
            <img className="hero-background-image" src="/images/hero-drive.jpg" alt="Sedã premium em uma estrada ao entardecer" fetchPriority="high" />
            <div className="hero-shade" />
            <div className="hero-content">
              <p className="hero-kicker"><span className="status-dot" /> CURADORIA AUTOMOTIVA, DO SEU JEITO</p>
              <h1 id="hero-title">Seu próximo carro.<br /><em>Uma nova história.</em></h1>
              <p className="hero-description">Veículos escolhidos a dedo, acessórios que fazem sentido e a liberdade de encontrar o caminho certo.</p>
              <a className="button button-lime hero-cta" href="#carros">Encontre seu próximo carro <Icon name="arrow" size={18} /></a>
            </div>
            <div className="hero-footnote"><span>01 / 04</span><span className="hero-footnote-line" /><span>O prazer de escolher bem.</span></div>
            <div className="hero-stamp"><Icon name="sparkle" size={16} /> <span>COM CALMA.<br />COM CRITÉRIO.</span></div>
          </div>

          <div className="search-card">
            <div className="search-tabs" role="tablist" aria-label="O que você está procurando?">
              <button
                className={searchTarget === "cars" ? "search-tab active" : "search-tab"}
                type="button"
                role="tab"
                aria-selected={searchTarget === "cars"}
                onClick={() => { setSearchTarget("cars"); setSearchOption("all"); }}
              ><Icon name="car" size={17} /> Comprar carro</button>
              <button
                className={searchTarget === "products" ? "search-tab active" : "search-tab"}
                type="button"
                role="tab"
                aria-selected={searchTarget === "products"}
                onClick={() => { setSearchTarget("products"); setSearchOption("all"); }}
              ><Icon name="bag" size={17} /> Acessórios</button>
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <label className="search-input-wrap">
                <Icon name="search" size={20} />
                <input
                  aria-label="Buscar"
                  type="search"
                  placeholder={searchTarget === "cars" ? "Marca, modelo ou palavra-chave" : "Produto, acessório ou categoria"}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>
              <label className="search-select-wrap">
                <span className="search-select-caption">{searchTarget === "cars" ? "MARCA" : "CATEGORIA"}</span>
                <select aria-label={searchTarget === "cars" ? "Selecionar marca" : "Selecionar categoria"} value={searchOption} onChange={(event) => setSearchOption(event.target.value)}>
                  {searchTarget === "cars" ? (
                    <>
                      <option value="all">Todas as marcas</option>
                      {Array.from(new Set(cars.map((car) => car.brand))).map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                    </>
                  ) : (
                    <>
                      <option value="all">Todas as categorias</option>
                      {Array.from(new Set(products.map((product) => product.category))).map((category) => <option key={category} value={category}>{category}</option>)}
                    </>
                  )}
                </select>
                <Icon name="chevron" size={15} />
              </label>
              <button className="search-submit" type="submit">Buscar <Icon name="arrow" size={17} /></button>
            </form>
          </div>
        </section>

        <section className="trust-strip page-container" aria-label="Benefícios motori">
          <div className="trust-item"><span className="trust-icon"><Icon name="shield" size={19} /></span><span><strong>Escolha com confiança</strong><small>Curadoria criteriosa</small></span></div>
          <span className="trust-divider" />
          <div className="trust-item"><span className="trust-icon"><Icon name="sparkle" size={19} /></span><span><strong>Detalhes que importam</strong><small>Transparência de ponta a ponta</small></span></div>
          <span className="trust-divider" />
          <div className="trust-item"><span className="trust-icon"><Icon name="truck" size={19} /></span><span><strong>Do nosso jeito até você</strong><small>Atendimento em todo o Brasil</small></span></div>
          <a className="trust-more" href="#sobre">Saiba mais <Icon name="arrow-up-right" size={15} /></a>
        </section>

        <section className="inventory-section section-container" id="carros" aria-labelledby="cars-title">
          <div className="section-header">
            <div>
              <p className="section-eyebrow"><span className="section-eyebrow-line" /> A PRÓXIMA GARAGEM</p>
              <h2 id="cars-title">Boas escolhas,<br className="mobile-break" /> <em>sem atalhos.</em></h2>
              <p className="section-description">Carros especiais, histórias diferentes. O seu pode estar aqui.</p>
            </div>
            <button className="text-link desktop-link" type="button" onClick={() => { setCarFilter("Todos"); setSearchOption("all"); setSearchTerm(""); setSearchTarget("cars"); }}>Ver toda a seleção <Icon name="arrow-up-right" size={17} /></button>
          </div>

          <div className="listing-toolbar">
            <div className="filter-pills" role="group" aria-label="Filtrar por tipo de carro">
              {(["Todos", "SUVs", "Sedans", "Esportivos"] as CarFilter[]).map((filter) => (
                <button
                  className={carFilter === filter ? "filter-pill active" : "filter-pill"}
                  type="button"
                  key={filter}
                  onClick={() => { setCarFilter(filter); setSearchTarget("cars"); }}
                >{filter === "Todos" ? "Todos os carros" : filter}</button>
              ))}
            </div>
            <p className="result-count">{filteredCars.length} {filteredCars.length === 1 ? "carro selecionado" : "carros selecionados"}</p>
          </div>

          {filteredCars.length > 0 ? (
            <div className="car-grid">
              {filteredCars.map((car, index) => (
                <article className="car-card" key={car.id} style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="car-image-wrap">
                    <img src={car.image} alt={car.imageAlt} loading="lazy" decoding="async" />
                    <span className="car-badge"><Icon name="sparkle" size={12} /> {car.badge}</span>
                    <button
                      className={favorites.includes(car.id) ? "favorite-button is-favorite" : "favorite-button"}
                      type="button"
                      aria-label={favorites.includes(car.id) ? `Remover ${car.model} da garagem` : `Salvar ${car.model} na garagem`}
                      aria-pressed={favorites.includes(car.id)}
                      onClick={() => toggleFavorite(car.id)}
                    ><Icon name="heart" size={19} /></button>
                  </div>
                  <div className="car-card-body">
                    <div className="car-card-overline"><span>{car.brand}</span><span className="car-year">{car.year}</span></div>
                    <h3>{car.model}</h3>
                    <div className="car-specs"><span><Icon name="location" size={14} /> São Paulo, SP</span><span><i /> {formatKilometers(car.kilometers)}</span></div>
                    <div className="car-secondary-specs"><span>{car.transmission}</span><span>{car.fuel}</span></div>
                    <div className="car-card-footer">
                      <div><span className="price-caption">À vista</span><strong>{formatCurrency(car.price)}</strong></div>
                      <button className="car-open-button" type="button" aria-label={`Consultar ${car.brand} ${car.model}`} onClick={() => openLead(`Interesse no ${car.brand} ${car.model}`)}><Icon name="arrow-up-right" size={19} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results"><span className="empty-search-icon"><Icon name="search" size={23} /></span><h3>Nenhum resultado por aqui.</h3><p>Tente outra busca ou remova alguns filtros para ver mais opções.</p><button className="text-link" type="button" onClick={() => { setCarFilter("Todos"); setSearchOption("all"); setSearchTerm(""); }}>Limpar filtros <Icon name="arrow" size={16} /></button></div>
          )}
          <button className="text-link mobile-link" type="button" onClick={() => { setCarFilter("Todos"); setSearchOption("all"); setSearchTerm(""); }}>Ver toda a seleção <Icon name="arrow-up-right" size={17} /></button>
        </section>

        <section className="products-section" id="produtos" aria-labelledby="products-title">
          <div className="section-container products-inner">
            <div className="section-header products-header">
              <div>
                <p className="section-eyebrow"><span className="section-eyebrow-line" /> FEITOS PARA IR JUNTO</p>
                <h2 id="products-title">Pequenos detalhes.<br /><em>Grandes viagens.</em></h2>
                <p className="section-description">Acessórios escolhidos para deixar o caminho ainda melhor.</p>
              </div>
              <div className="products-note"><span className="products-note-dot" /> Frete grátis em compras acima de R$ 299</div>
            </div>

            <div className="product-filters" role="group" aria-label="Categorias de acessórios">
              <button className={searchOption === "all" || searchTarget !== "products" ? "product-filter active" : "product-filter"} type="button" onClick={() => { setSearchTarget("products"); setSearchOption("all"); }}>Tudo</button>
              {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                <button className={searchTarget === "products" && searchOption === category ? "product-filter active" : "product-filter"} key={category} type="button" onClick={() => { setSearchTarget("products"); setSearchOption(category); }}>{category}</button>
              ))}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product, index) => (
                  <article className="product-card" key={product.id} style={{ animationDelay: `${index * 80}ms` }}>
                    <div className="product-image-wrap">
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                      <span className="product-badge">{product.badge}</span>
                      <span className="product-discount">-{Math.round((1 - product.price / product.previousPrice) * 100)}%</span>
                    </div>
                    <div className="product-card-body">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="product-price-row"><strong>{formatCurrency(product.price)}</strong><del>{formatCurrency(product.previousPrice)}</del></div>
                      <button className="add-to-cart-button" type="button" onClick={() => addToCart(product.id)}>Adicionar ao carrinho <Icon name="bag" size={17} /></button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-results product-empty"><span className="empty-search-icon"><Icon name="search" size={23} /></span><h3>Nenhum acessório encontrado.</h3><p>Experimente outra categoria ou palavra-chave.</p><button className="text-link" type="button" onClick={() => { setSearchOption("all"); setSearchTerm(""); }}>Ver todos os acessórios <Icon name="arrow" size={16} /></button></div>
            )}
            <div className="product-service-note"><Icon name="check" size={16} /> Compra segura <span /> Embalagem protegida <span /> Suporte humano de verdade</div>
          </div>
        </section>

        <section className="catalogue-section section-container" id="catalogos" aria-labelledby="catalogue-title">
          <div className="section-header catalogue-heading">
            <div>
              <p className="section-eyebrow"><span className="section-eyebrow-line" /> CURADORIAS QUE INSPIRAM</p>
              <h2 id="catalogue-title">Um bom começo<br className="mobile-break" /> <em>para cada caminho.</em></h2>
            </div>
            <p className="catalogue-intro">Pequenos guias para encontrar um carro que combine com a sua vida — e não o contrário.</p>
          </div>
          <div className="catalogue-grid">
            {catalogues.map((catalogue, index) => (
              <article className="catalogue-card" key={catalogue.eyebrow} style={{ animationDelay: `${index * 90}ms` }}>
                <img src={catalogue.image} alt={catalogue.imageAlt} loading="lazy" decoding="async" />
                <div className="catalogue-shade" />
                <div className="catalogue-content">
                  <span className="catalogue-eyebrow">{catalogue.eyebrow}</span>
                  <h3>{catalogue.title.split("\n").map((line, lineIndex) => <span key={line}>{lineIndex > 0 && <br />}{line}</span>)}</h3>
                  <p>{catalogue.description}</p>
                  <button type="button" className="catalogue-action" onClick={() => chooseCatalogue(catalogue.filter)}>Explorar seleção <Icon name="arrow-up-right" size={16} /></button>
                </div>
                <span className="catalogue-count">{catalogue.count}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="promise-section" id="sobre" aria-labelledby="promise-title">
          <div className="promise-container">
            <div className="promise-copy">
              <p className="section-eyebrow light-eyebrow"><span className="section-eyebrow-line" /> POR TRÁS DE CADA ESCOLHA</p>
              <h2 id="promise-title">Comprar com confiança também faz parte <em>da viagem.</em></h2>
              <p>A gente cuida do caminho para você curtir o destino: informação clara, atendimento próximo e uma seleção feita com critério.</p>
              <button type="button" className="button button-lime" onClick={() => openLead("Quero conhecer a curadoria motori")}>Converse com a gente <Icon name="arrow" size={17} /></button>
            </div>
            <div className="promise-features">
              <article className="promise-feature"><span className="promise-feature-icon"><Icon name="shield" size={22} /></span><div><span className="promise-feature-number">01</span><h3>Procedência em primeiro lugar</h3><p>Histórico e informações para uma escolha bem pensada.</p></div></article>
              <article className="promise-feature"><span className="promise-feature-icon"><Icon name="user" size={22} /></span><div><span className="promise-feature-number">02</span><h3>Gente de verdade, por perto</h3><p>Especialistas para ajudar no antes, durante e depois.</p></div></article>
              <article className="promise-feature"><span className="promise-feature-icon"><Icon name="sparkle" size={22} /></span><div><span className="promise-feature-number">03</span><h3>Só o que faz sentido</h3><p>Menos excesso. Mais opções que valem o seu tempo.</p></div></article>
            </div>
          </div>
          <div className="promise-decoration" aria-hidden="true">m.</div>
        </section>

        <section className="newsletter-section section-container" aria-labelledby="newsletter-title">
          <div className="newsletter-mark"><Icon name="mail" size={22} /></div>
          <div className="newsletter-copy"><p className="section-eyebrow"><span className="section-eyebrow-line" /> A REVISTA MOTORI</p><h2 id="newsletter-title">Boas histórias chegam <em>por e-mail.</em></h2><p>Ideias para dirigir melhor, cuidar bem e aproveitar o caminho.</p></div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <label className="sr-only" htmlFor="newsletter-email">Seu melhor e-mail</label>
            <input id="newsletter-email" name="newsletter-email" type="email" placeholder="Seu melhor e-mail" required value={newsletterEmail} onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterStatus("idle"); }} />
            <button type="submit" aria-label="Assinar a newsletter" disabled={newsletterStatus === "sending" || newsletterStatus === "success"}>{newsletterStatus === "sending" ? "Enviando…" : newsletterStatus === "success" ? "Inscrito ✓" : "Quero receber"}<Icon name="arrow" size={17} /></button>
            {newsletterStatus === "error" && <span className="newsletter-feedback error-feedback">Não foi possível concluir. Tente novamente.</span>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main section-container">
          <div className="footer-brand-column">
            <a className="brand-lockup footer-brand" href="#inicio" aria-label="motori — voltar ao início"><span className="brand-symbol"><Icon name="car" size={20} /></span><span className="brand-word">motori<span>.</span></span></a>
            <p>Uma escolha melhor muda o caminho. A gente acredita nisso.</p>
          </div>
          <div className="footer-links-group"><span className="footer-heading">Explore</span><a href="#carros">Carros</a><a href="#produtos">Acessórios</a><a href="#catalogos">Catálogos</a></div>
          <div className="footer-links-group"><span className="footer-heading">A motori</span><a href="#sobre">Nossa curadoria</a><button type="button" onClick={() => openLead("Quero anunciar meu veículo")}>Anuncie seu carro</button><button type="button" onClick={() => openLead("Quero falar com a equipe motori")}>Fale com a gente</button></div>
          <div className="footer-contact"><span className="footer-heading">Fique à vontade</span><span><Icon name="location" size={16} /> Atendimento em todo o Brasil</span><span><Icon name="calendar" size={16} /> Seg–Sáb, das 9h às 18h</span></div>
        </div>
        <div className="footer-bottom section-container"><span>© 2025 motori. Feito para ir mais longe.</span><div><a href="#sobre">Privacidade</a><span className="footer-bottom-dot" /><a href="#inicio">Voltar ao topo ↑</a></div><span className="footer-signoff">Escolha o caminho. <em>A gente acompanha.</em></span></div>
      </footer>

      {drawer && (
        <div className="overlay-layer drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawer(null); }}>
          <aside className="side-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <div className="drawer-header"><div><span className="drawer-eyebrow">SUA MOTORI</span><h2 id="drawer-title">{drawer === "cart" ? "Seu carrinho" : "Sua garagem"}</h2></div><button className="close-button" type="button" aria-label="Fechar painel" onClick={() => setDrawer(null)}><Icon name="close" size={21} /></button></div>
            {drawer === "cart" ? (
              cart.length > 0 ? (
                <>
                  <div className="drawer-items">
                    {cart.map((line) => {
                      const product = products.find((candidate) => candidate.id === line.productId);
                      if (!product) return null;
                      return <article className="drawer-line" key={line.productId}><img src={product.image} alt="" /><div className="drawer-line-info"><span>{product.category}</span><h3>{product.name}</h3><strong>{formatCurrency(product.price)}</strong><div className="quantity-control"><button type="button" aria-label={`Diminuir quantidade de ${product.name}`} onClick={() => updateQuantity(product.id, line.quantity - 1)}><Icon name="minus" size={14} /></button><span>{line.quantity}</span><button type="button" aria-label={`Aumentar quantidade de ${product.name}`} onClick={() => updateQuantity(product.id, line.quantity + 1)}><Icon name="plus" size={14} /></button></div></div></article>;
                    })}
                  </div>
                  <div className="drawer-summary"><div className="drawer-total-row"><span>Subtotal</span><strong>{formatCurrency(cartTotal)}</strong></div><p>Frete calculado no atendimento. Sem surpresas no caminho.</p><button className="button button-dark full-width" type="button" onClick={() => openLead(`Pedido de acessórios: ${cart.map((line) => { const product = products.find((candidate) => candidate.id === line.productId); return `${product?.name ?? "Produto"} × ${line.quantity}`; }).join(", ")}`)}>Solicitar meu pedido <Icon name="arrow" size={17} /></button></div>
                </>
              ) : (
                <div className="drawer-empty"><span><Icon name="bag" size={26} /></span><h3>Seu carrinho está leve.</h3><p>Boas viagens também começam com bons acessórios.</p><button type="button" className="button button-dark" onClick={() => { setDrawer(null); scrollToSection("produtos"); }}>Explorar acessórios <Icon name="arrow" size={16} /></button></div>
              )
            ) : favoriteCars.length > 0 ? (
              <>
                <div className="drawer-items favorites-list">
                  {favoriteCars.map((car) => <article className="favorite-line" key={car.id}><img src={car.image} alt={car.imageAlt} /><div><span>{car.brand} · {car.year}</span><h3>{car.model}</h3><strong>{formatCurrency(car.price)}</strong><button type="button" className="favorite-contact-link" onClick={() => openLead(`Interesse no ${car.brand} ${car.model}`)}>Tenho interesse <Icon name="arrow-up-right" size={14} /></button></div><button className="remove-favorite-button" type="button" aria-label={`Remover ${car.model} dos favoritos`} onClick={() => toggleFavorite(car.id)}><Icon name="close" size={16} /></button></article>)}
                </div>
                <div className="drawer-summary"><p>Salvamos suas escolhas neste dispositivo. A sua próxima história está mais perto.</p><button className="button button-dark full-width" type="button" onClick={() => { setDrawer(null); scrollToSection("carros"); }}>Continuar explorando <Icon name="arrow" size={17} /></button></div>
              </>
            ) : (
              <div className="drawer-empty"><span><Icon name="heart" size={26} /></span><h3>Uma garagem em branco.</h3><p>Toque no coração de um carro para guardar aqui as suas escolhas.</p><button type="button" className="button button-dark" onClick={() => { setDrawer(null); scrollToSection("carros"); }}>Encontrar um carro <Icon name="arrow" size={16} /></button></div>
            )}
          </aside>
        </div>
      )}

      {leadInterest && (
        <div className="overlay-layer contact-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLead(); }}>
          <section className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <button className="close-button contact-close" type="button" aria-label="Fechar formulário" onClick={closeLead}><Icon name="close" size={21} /></button>
            <div className="contact-visual"><img src="/images/hero-drive.jpg" alt="Carro em uma estrada ao entardecer" /><div className="contact-visual-shade" /><span className="contact-visual-brand">motori<span>.</span></span><div className="contact-visual-copy"><Icon name="sparkle" size={20} /><p>Uma boa escolha começa com uma boa conversa.</p></div></div>
            <div className="contact-form-side">
              <p className="section-eyebrow"><span className="section-eyebrow-line" /> CONTE COM A GENTE</p>
              {leadStatus === "success" ? (
                <div className="form-success"><span><Icon name="check" size={24} /></span><h2 id="contact-title">Recebemos seu pedido.</h2><p>Obrigado por escolher a motori. Nossa equipe entra em contato em breve para seguir essa conversa.</p><button className="button button-dark full-width" type="button" onClick={closeLead}>Voltar para a página <Icon name="arrow" size={17} /></button></div>
              ) : (
                <>
                  <h2 id="contact-title">Vamos tirar esse plano do papel?</h2>
                  <p className="contact-intro">Conte como podemos ajudar. Um especialista motori fala com você em breve.</p>
                  <div className="interest-pill"><Icon name="sparkle" size={14} /> {leadInterest}</div>
                  <form className="contact-form" onSubmit={handleLeadSubmit}>
                    <input type="hidden" name="interest" value={leadInterest} />
                    <label>Seu nome<input name="name" type="text" autoComplete="name" placeholder="Como podemos te chamar?" minLength={2} maxLength={120} required /></label>
                    <div className="form-field-row"><label>Seu e-mail<input name="email" type="email" autoComplete="email" placeholder="voce@email.com" maxLength={254} required /></label><label>WhatsApp <span className="optional-label">opcional</span><input name="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" maxLength={40} /></label></div>
                    {leadStatus === "error" && <p className="form-error" role="alert">Não foi possível enviar agora. Confira seus dados e tente novamente.</p>}
                    <button className="button button-dark full-width" type="submit" disabled={leadStatus === "sending"}>{leadStatus === "sending" ? "Enviando…" : "Quero conversar"}<Icon name="arrow" size={17} /></button>
                    <p className="privacy-note"><Icon name="shield" size={14} /> Seus dados são usados apenas para responder à sua solicitação.</p>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast-message" role="status" aria-live="polite"><span className="toast-check"><Icon name="check" size={16} /></span>{toast}</div>}
    </>
  );
}
