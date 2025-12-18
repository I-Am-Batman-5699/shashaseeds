export interface FeatureToggleProps {
  "products-page": ProductsPage
  "about-us-page": AboutUsPage
}

export interface ProductsPage {
  sections: Sections
  features: Features
  actionButtons: ActionButton
  sort: Sort
  filters: Filters
  displayData: DisplayData
}

export interface Sections {
  searchBar: boolean
  sortControls: boolean
  filterControls: boolean
}

export interface Features {
  showPrice: boolean
  showDiscount: boolean
  showRating: boolean
  showTags: boolean
  showStock: boolean
  showNewBadge: boolean
  showSaleBadge: boolean
  showFeaturedBadge: boolean
}

export interface ActionButton {
  enableAddToCart?: boolean
  enableWishlist?: boolean
  enableEnquire?: boolean
  enableCompare?: boolean
  enableReview?: boolean
  showFeaturedBadge?: boolean
  showAddToCartButton?: boolean
  showWishlistButton?: boolean
  showEnquireButton?: boolean
  showCompareButton?: boolean
  showReview?: boolean
}

export interface Sort {
  enableSortBy: boolean
  defaultSortBy: string
  availableOptions: AvailableOptions
}

export interface AvailableOptions {
  relevance: string
  newest: string
  "price-asc": string
  "price-desc": string
  "rating-desc": string
}

export interface Filters {
  enableFilters: boolean
  availableOptions: AvailableOptions2
  defaultState: DefaultState
}

export interface AvailableOptions2 {
  type: Type
  organic: Organic
  available: Available
  rating: Rating
}

export interface Type {
  enabled: boolean
  options: string[]
}

export interface Organic {
  enabled: boolean
  options: boolean[]
}

export interface Available {
  enabled: boolean
  options: boolean[]
}

export interface Rating {
  enabled: boolean
  options: number[]
}

export interface DefaultState {
  type: any
  organic: any
  available: any
  rating: any
}

export interface DisplayData {
  loadingMessage: string
  searchPlaceholder: string
  defaultTitle: string
  sortButtonAriaLabel: string
  filterButtonAriaLabel: string
  filterPanelTitle: string
  closeFilterPanelAriaLabel: string
  fixedFilterLabel: string
  noItemsFoundTitle: string
  noItemsFoundMessage: string
  filterDisplayNames: FilterDisplayNames
  filterOptionDisplayNames: FilterOptionDisplayNames
}

export interface FilterDisplayNames {
  type: string
  organic: string
  available: string
  rating: string
}

export interface FilterOptionDisplayNames {
  flower: string
  vegetable: string
  herb: string
  fruit: string
  "available-true": string
  "available-false": string
  "4": string
  "3.5": string
  "3": string
  "organic-true": string
  "organic-false": string
}

export interface AboutUsPage {
  sections: AboutUsPageSection
}

export interface AboutUsPageSection {
  showFounderProfile: boolean
  showBenefits: boolean
  showTestimonials: boolean
  showMission: boolean
  showStory: boolean
  showMissionVision: boolean
  showTeam: boolean
}