import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, ShieldAlert } from "lucide-react"
import { format } from "date-fns"

export type AnalysisResultProps = {
  result: {
    id: number
    cap_rate: number
    cash_on_cash: number
    irr: number | null
    pass_status: boolean
    recommendations: string[]
    created_at: string
    deal: number
    risk_score?: string | null
    risk_flags?: string[]
    risk_explanation?: string | null
  }
}

export default function AnalysisResultCard({ result }: { result: AnalysisResultProps['result'] }) {
  const formattedDate = format(new Date(result.created_at), 'PPP p')

  return (
    <Card className="w-full max-w-3xl mt-4 shadow-xl border border-muted/40 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Deal #{result.deal} Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Analyzed on {formattedDate}</p>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="space-y-5">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2.5 items-center">
            <span className="text-muted-foreground">Cap Rate</span>
            <p className="font-medium">{(result.cap_rate * 100).toFixed(2)}%</p>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-muted-foreground">Cash-on-Cash</span>
            <p className="font-medium">{(result.cash_on_cash * 100).toFixed(2)}%</p>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-muted-foreground">IRR</span>
            <p className="font-medium">
              {result.irr !== null ? `${(result.irr * 100).toFixed(2)}%` : "N/A"}
            </p>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-muted-foreground">Status</span>
            <div className="flex items-center gap-1 font-medium">
              {result.pass_status ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Pass</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Fail</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Risk Section */}
        {(result.risk_score || result.risk_flags?.length) && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-medium">Risk Analysis</p>
              {result.risk_score && (
                <Badge variant="outline" className="ml-auto text-yellow-800 border-yellow-500">
                  Risk: {result.risk_score}
                </Badge>
              )}
            </div>
            {result.risk_flags?.length && result.risk_flags?.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.risk_flags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Recommendations Section */}
        {/* {result.recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium">AI Recommendations</p>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {result.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}
