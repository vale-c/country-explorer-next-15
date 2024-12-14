export interface CityData {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  address: {
    city?: string
    town?: string
    county: string
    state: string
    country: string
    country_code: string
    postcode: string
  }
  boundingbox: string[]
}
