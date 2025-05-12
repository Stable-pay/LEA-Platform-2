
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";

const strFormSchema = z.object({
  strId: z.string().optional(),
  caseReference: z.string().min(1, "Case reference is required"),
  reportType: z.string().min(1, "Report type is required"),
  primaryWallet: z.string().min(1, "Primary wallet address is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  transactionDate: z.string().min(1, "Transaction date is required"),
  amount: z.string().min(1, "Amount is required"),
  includeBlockchain: z.boolean().default(true),
  includeKyc: z.boolean().default(true),
  includePattern: z.boolean().default(true),
  includeExchange: z.boolean().default(true),
  status: z.string().default("draft"),
});

const reportTypes = [
  "Crypto Scam",
  "Money Laundering",
  "Exchange Fraud",
  "Unauthorized Access",
  "Market Manipulation",
  "Ransomware Payment",
  "Terrorist Financing",
  "Other",
];

export default function StrFilingForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof strFormSchema>>({
    resolver: zodResolver(strFormSchema),
    defaultValues: {
      includeBlockchain: true,
      includeKyc: true,
      includePattern: true,
      includeExchange: true,
      status: "draft",
    },
  });

  const createStrMutation = useMutation({
    mutationFn: async (values: z.infer<typeof strFormSchema>) => {
      const response = await fetch('/api/str-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include'
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
        description: "The report has been saved successfully",
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
        <CardDescription>Submit a new Suspicious Transaction Report with blockchain evidence</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="caseReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Reference</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter case reference ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="primaryWallet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Wallet Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter wallet address" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main wallet address involved in suspicious activity
                    </FormDescription>
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
                      <Input type="number" placeholder="Enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed description of suspicious activity"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="includeBlockchain"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Include Blockchain Data</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeKyc"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Include KYC Info</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includePattern"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Include Pattern Analysis</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeExchange"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Include Exchange Data</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FileUploader
              value={files}
              onChange={setFiles}
              maxFiles={5}
              maxSize={5242880}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
