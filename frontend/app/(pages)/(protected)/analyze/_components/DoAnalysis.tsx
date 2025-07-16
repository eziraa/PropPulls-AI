import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog"
  import { Building2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { CardContent } from "@/components/ui/card"
  import { toast } from "sonner"
  import { useState } from "react"
  import { useForm } from "react-hook-form"
import { dealApi, useAnalyzeDealMutation } from "@/lib/redux/api/deal.api"
import AnalysisResultCard from "./AnalysisResult"
  
  export default function AnalyzeDealDialog({ dealId }: { dealId: number }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisFinished, setAnalysisFinished] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)
  
    const [analyzeDeal] = useAnalyzeDealMutation() // Assuming this is a hook to trigger the analysis
    const { handleSubmit } = useForm()
  
    const handleAnalyze = () => {
      setIsAnalyzing(true)
      setAnalysisFinished(false)
      if (!dealId) {
        toast.error("Deal ID is not set. Please create a deal first.")
        return
      }
  
      analyzeDeal(dealId)
        .unwrap()
        .then((result) => {
          setAnalysisFinished(true)
          setAnalysisResult(result)
          toast.success("Deal analysis completed successfully")
        })
        .catch((error) => {
          console.error("Error analyzing deal:", error)
          toast.error("Failed to analyze deal")
          dealApi.util.invalidateTags(['Deals'])
        })
        .finally(() => {
          setIsAnalyzing(false)
        })
    }
  
    return (
      <Dialog onOpenChange={() => {
        setIsAnalyzing(false)
        setAnalysisFinished(false)
        setAnalysisResult(null)
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg">
            Run AI Analysis
          </Button>
        </DialogTrigger>
  
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              AI Deal Analysis
            </DialogTitle>
            <DialogDescription>
              Our AI will analyze your deal data and return a full investment report.
            </DialogDescription>
          </DialogHeader>
  
          <CardContent className="space-y-6">
            {!analysisFinished && (
              !isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span>Property data fetched from integrations</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span>Financial documents processed</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <AlertCircle className="h-6 w-6 text-yellow-500" />
                      <span>Ready to analyze deal</span>
                    </div>
                  </div>
  
                  <Button
                    onClick={handleSubmit(handleAnalyze)}
                    size="lg"
                    className="mt-8"
                  >
                    Start Analysis
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <h3 className="text-lg font-medium mt-4">Analyzing Deal...</h3>
                  <p className="text-muted-foreground mt-2">This usually takes 30 seconds</p>
                  <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <div>Fetching market comparables...</div>
                    <div>Calculating financial metrics...</div>
                    <div>Generating recommendations...</div>
                  </div>
                </div>
              )
            )}
  
            {analysisFinished && (
              <div className="text-center flex flex-col items-center mt-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="text-lg font-medium mt-4">Analysis Completed</h3>
                <p className="text-muted-foreground mt-2">Your deal analysis is ready!</p>
                {analysisResult && (
                  <div className="w-full mt-4">
                    <AnalysisResultCard result={analysisResult} />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </DialogContent>
      </Dialog>
    )
  }
  