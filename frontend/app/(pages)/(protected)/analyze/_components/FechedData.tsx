import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export type DealProps = {
  id: number
  analysis_result: any
  pass_status: boolean
  address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  created_at: string
  asking_price: number
  fetched_data: {
    bedrooms: number
    bathrooms: number
    sqft: number
    price: number
    rent: number
    cap_rate: number
    year_built: number
  }
  user: number
}

export default function DealCard({ deal }: { deal: DealProps }) {
  const formattedDate = format(new Date(deal.created_at), 'PPP p')

  return (
    <Card className="my-3  w-full border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-primary font-semibold">Deal #{deal.id}</CardTitle>
        <p className="text-sm text-muted-foreground">Fetchd on {formattedDate}</p>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 text-sm">
        {/* Address Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-muted-foreground">Address</span>
            <p>{deal.address}, {deal.city}, {deal.state} {deal.zip_code}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Property Type</span>
            <p>{deal.property_type || 'N/A'}</p>
          </div>
        </div>

        {/* Deal & Property Data */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-muted-foreground">Asking Price</span>
            <p className="font-medium">${deal.asking_price.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Rent</span>
            <p className="font-medium">${deal.fetched_data.rent}/mo</p>
          </div>
          <div>
            <span className="text-muted-foreground">Cap Rate</span>
            <p className="font-medium">{(deal.fetched_data.cap_rate * 100).toFixed(2)}%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Sqft</span>
            <p className="font-medium">{deal.fetched_data.sqft} ft²</p>
          </div>
          <div>
            <span className="text-muted-foreground">Beds / Baths</span>
            <p className="font-medium">{deal.fetched_data.bedrooms} / {deal.fetched_data.bathrooms}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Year Built</span>
            <p className="font-medium">{deal.fetched_data.year_built}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
