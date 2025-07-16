"use client"
import { toast } from "sonner"
import { useState } from "react"
import { set, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Building2, Upload, MapPin, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAnalyzeDealMutation, useCreateDealMutation, useUploadDealDocumentMutation } from "@/lib/redux/api/deal.api"
import AnalysisResultCard from "./_components/AnalysisResult"
import DealCard, { DealProps } from "./_components/FechedData"

interface AnalyzeForm {
  address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  asking_price: number
}

interface IDocument {
  file: File
  fileType: string
  saved?: boolean
}

export default function AnalyzePage() {
  const [step, setStep] = useState(1)
  const [dealId, setDealId] = useState<number | null>(null)
  const [analysisFinished, setAnalysisFinished] = useState(false)
  const [properyData, setPropertyData] = useState<DealProps | null>(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<IDocument[]>([])
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [createDeal] = useCreateDealMutation();
  const [uploadDocument] = useUploadDealDocumentMutation();
  const [analyzeDeal] = useAnalyzeDealMutation();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalyzeForm>()

  const onSubmit = async (data: AnalyzeForm) => {
    setIsAnalyzing(true)
    try {
      // Simulate API call to create deal
      console.log("Creating deal with data:", data)
      const res = await createDeal(data).unwrap()
      console.log("Deal created successfully:", res)
      setDealId(res.id)
      toast.success("Propery data fetched successfully")
      setUploadedFiles((prev) => prev.map(doc => ({ ...doc, saved: false })))
      // Proceed to next step
      setPropertyData(res)
    } catch (error) {
      console.error("Error creating deal:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = async (file: any, fileType: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("doc_type", fileType)

      // Simulate API call to upload document
      if (!dealId) {
        toast.error("Deal ID is not set. Please create a deal first.")
        return
      }
      await uploadDocument({ id: dealId, data: formData }).unwrap()
      setUploadedFiles((prev) => prev.map(doc => doc.fileType === fileType ? { ...doc, saved: true } : doc))
      toast.success(`${fileType} saved successfully`)
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error(`Failed to upload ${fileType}`)
    }

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Building2 className="h-8 w-8 text-blue-600" />
              </Link>
              <span className="ml-2 text-2xl font-bold text-gray-900">Analyze New Deal</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <span className={step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>Property Details</span>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <span className={step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>Upload Documents</span>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <span className={step >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}>Analysis</span>
            </div>
          </div>
          <Progress value={(step / 3) * 100} className="w-full" />
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Property Information
              </CardTitle>
              <CardDescription>Enter the property address and basic details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Property Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    {...register("address", { required: "Street address is required" })}
                  />
                  {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Atlanta" {...register("city", { required: "City is required" })} />
                    {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" placeholder="GA" {...register("state", { required: "State is required" })} />
                    {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      placeholder="6000"
                      {...register("zip_code", { required: "ZIP code is required" })}
                    />
                    {errors.zip_code && <p className="text-sm text-red-600">{errors.zip_code.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select onValueChange={(value) => setValue("property_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multifamily">Multi-Family</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="asking_price">Asking Price *</Label>
                    <div className="flex gap-4 flex-col md:flex-row items-center">
                      <Input
                        id="asking_price"
                        type="number"
                        placeholder="2400000"
                        {...register("asking_price", {
                          required: "Asking price is required",
                          min: { value: 1, message: "Price must be greater than 0" },
                        })}
                        className="w-full md:w-1/2"
                      />
                      <Button type="submit" disabled={isSubmitting} className="md:w-1/2 w-full self-end">
                        Fetch Property Data
                      </Button>
                    </div>
                    {errors.asking_price && <p className="text-sm text-red-600">{errors.asking_price.message}</p>}
                  </div>
                </div>
                {
                  properyData && (
                    <DealCard deal={properyData} />
                  )
                }
              </form>
              <Button disabled={!properyData} onClick={() => setStep(2)} className="w-full">
                Continue to Document Upload
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Financial Documents
              </CardTitle>
              <CardDescription>Upload T12 financials and rent roll for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* T12 Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <Input
                    id="t12"
                    type="file"
                    accept=".pdf,.xlsx,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        setUploadedFiles((prev) => [...prev, { file, fileType: 't12' }])
                      }
                    }}
                    className="hidden"
                  />
                  <div className="mt-4">
                    <Label className="text-lg font-medium">T12 Financials</Label>

                    <Button variant={"outline"} onClick={() => {
                      const input = document.querySelector<HTMLInputElement>('#t12')
                      input?.click()
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      <p className="text-sm text-gray-500 mt-1">Upload T12 document</p>
                    </Button>
                  </div>
                  <div className="mt-4">

                    {
                      uploadedFiles.some(file => file.fileType === 't12') && (
                        uploadedFiles.find(file => file.fileType === 't12')?.saved ? (
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-primary">T12 Saved successfully</span>
                          </div>
                        )
                          :
                          <Button disabled={!uploadedFiles.some(file => file.fileType === 't12')} variant="outline" onClick={() => {
                            const document = uploadedFiles.find(file => file.fileType === 't12')
                            if (document) {
                              handleFileUpload(document.file, 't12')
                            }
                          }}>
                            <Upload className="h-4 w-4 mr-2" />
                            Save T12 Document
                          </Button>

                      )}
                  </div>
                </div>
              </div>

              {/* Rent Roll Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label className="text-lg font-medium">Rent Roll</Label>
                    <Input
                      id="rentRoll"
                      type="file"
                      accept=".pdf,.xlsx,.csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0]
                          setUploadedFiles((prev) => [...prev, { file, fileType: 'rent_roll' }])
                        }
                      }}
                      className="hidden"
                    />
                    <Button variant={"outline"} onClick={() => {
                      const input = document.querySelector<HTMLInputElement>('#rentRoll')
                      input?.click()
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Rent Roll
                    </Button>
                  </div>
                  <div className="mt-4">
                    {
                      uploadedFiles.some(file => file.fileType === 'rent_roll') && (
                        uploadedFiles.find(file => file.fileType === 'rent_roll')?.saved ? (
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span className="text-primary">Rent Roll Saved successfully</span>
                          </div>
                        ) :
                          <Button disabled={!uploadedFiles.some(file => file.fileType === 'rent_roll')} variant="outline" onClick={() => {
                            const document = uploadedFiles.find(file => file.fileType === 'rent_roll')
                            if (document) {
                              handleFileUpload(document.file, 'rent_roll')
                            }
                          }}>
                            <Upload className="h-4 w-4 mr-2" />
                            Save Rent Roll
                          </Button>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={uploadedFiles.length < 2 || uploadedFiles.some(file => !file.saved)}>
                  Continue to Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                AI Analysis
              </CardTitle>
              <CardDescription>Our AI is analyzing your deal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {
                !analysisFinished && (
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
                      <Button onClick={handleSubmit(() => {
                        setIsAnalyzing(true)
                        setAnalysisFinished(false)
                        if (!dealId) {
                          toast.error("Deal ID is not set. Please create a deal first.")
                          return
                        }
                        analyzeDeal(dealId).unwrap()
                          .then((result) => {
                            setAnalysisFinished(true)
                            setAnalysisResult(result)
                            toast.success("Deal analysis started successfully")
                            setIsAnalyzing(false)
                          })
                          .catch((error) => {
                            console.error("Error analyzing deal:", error)
                            toast.error("Failed to start deal analysis")
                            setIsAnalyzing(false)
                            setAnalysisFinished(false)
                          })
                      })} size="lg" className="mt-8">
                        Start Analysis
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                      <h3 className="text-lg font-medium mt-4">Analyzing Deal...</h3>
                      <p className="text-gray-500 mt-2">This usually takes 30 seconds</p>
                      <div className="mt-6 space-y-2">
                        <div className="text-sm text-gray-600">Fetching market comparables...</div>
                        <div className="text-sm text-gray-600">Calculating financial metrics...</div>
                        <div className="text-sm text-gray-600">Generating recommendations...</div>
                      </div>
                    </div>
                  )
                )}
              {analysisFinished && (
                <div className="text-center  flex flex-col items-center mt-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <h3 className="text-lg font-medium mt-4">Analysis Completed</h3>
                  <p className="text-gray-500 mt-2">Your deal analysis is ready!</p>
                  {analysisResult && (
                    <AnalysisResultCard
                      result={analysisResult as any}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
