
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/ui/file-uploader";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowRight } from "lucide-react";

const strFormSchema = z.object({
  caseReference: z.string().min(1, "Case reference is required"),
  reportType: z.string().min(1, "Report type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  riskLevel: z.string().min(1, "Risk level is required"),
  patternId: z.string().min(1, "Pattern selection is required"),
  primaryWallet: z.string().min(1, "Primary wallet is required"),
  includeBlockchain: z.boolean().default(true),
  includeKyc: z.boolean().default(true),
  includePattern: z.boolean().default(true),
  includeExchange: z.boolean().default(true),
  vaspProvider: z.string().min(1, "VASP selection is required")
});

const StrFilingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Fetch patterns with proper error and loading handling
  const { data: patterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['patterns'],
    queryFn: async () => {
      const res = await fetch('/api/patterns');
      if (!res.ok) {
        throw new Error('Failed to fetch patterns');
      }
      return res.json();
    },
    initialData: []
  });

  // Fetch cases for search
  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: () => fetch('/api/cases').then(res => res.json())
  });

  const form = useForm({
    resolver: zodResolver(strFormSchema),
    defaultValues: {
      caseReference: "",
      reportType: "initial",
      description: "",
      amount: 0,
      riskLevel: "medium",
      patternId: "",
      primaryWallet: "",
      includeBlockchain: true,
      includeKyc: true,
      includePattern: true,
      includeExchange: true,
      vaspProvider: ""
    },
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const createStrMutation = useMutation({
    mutationFn: async (values: z.infer<typeof strFormSchema>) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await fetch('/api/str-reports', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create STR report');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast({
        title: "STR Report Created",
        description: "The report has been submitted successfully",
        variant: "success",
      });
      form.reset();
      setFiles([]);
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof strFormSchema>) => {
    setIsSubmitting(true);
    createStrMutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>File New STR Report</CardTitle>
        <CardDescription>Submit a new Suspicious Transaction Report</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="caseReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Reference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select case" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cases?.map((c: any) => (
                        <SelectItem key={c.caseId} value={c.caseId}>
                          {c.caseId} - {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patternId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suspicious Pattern</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {patterns?.map((p: any) => (
                        <SelectItem 
                          key={p.patternId} 
                          value={p.patternId}
                          className="flex items-center gap-2"
                        >
                          <span>{p.pattern}</span>
                          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                            p.riskLevel.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                            p.riskLevel.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {p.riskLevel}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vaspProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VASP Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select VASP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="binance">Binance</SelectItem>
                      <SelectItem value="wazirx">WazirX</SelectItem>
                      <SelectItem value="zebpay">ZebPay</SelectItem>
                      <SelectItem value="coindcx">CoinDCX</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the suspicious activity"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Amount (INR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Supporting Documents</FormLabel>
              <FileUploader
                onFilesSelected={handleFilesSelected}
                maxFiles={5}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setFiles([]);
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Report <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StrFilingForm;
