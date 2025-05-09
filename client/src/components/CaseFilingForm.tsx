import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
import { Loader2, CheckCircle, Clock, AlertTriangle, ArrowRight, FileCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const caseFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  reportedBy: z.string().min(2, "Reporter name is required"),
  status: z.string().default("active"),
  priority: z.string().default("medium"),
  estimatedLoss: z.coerce.number().min(0, "Estimated loss must be a positive number"),
  assignedDepartment: z.string().min(1, "Department assignment is required"),
  initiatorDepartment: z.string().min(1, "Task initiator is required"),
  confirmerDepartment: z.string().min(1, "Task confirmer is required"),
  walletAddress: z.string().min(1, "Wallet Address is required"),
  transactionHash: z.string().min(1, "Transaction Hash is required")
});

type CaseFormValues = z.infer<typeof caseFormSchema>;

const BlockchainVerification = ({
  isVerifying,
  verificationStage,
  txHash,
  confirmations
}: {
  isVerifying: boolean;
  verificationStage: number;
  txHash: string | null;
  confirmations: number;
}) => {
  const stages = [
    { label: "Case Submission", icon: <FileCheck className="h-4 w-4" /> },
    { label: "Node Verification", icon: <Clock className="h-4 w-4" /> },
    { label: "Consensus Building", icon: <AlertTriangle className="h-4 w-4" /> },
    { label: "Transaction Confirmed", icon: <CheckCircle className="h-4 w-4" /> }
  ];

  return (
    <div className="mt-6 border rounded-md p-4 bg-neutral-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">Blockchain Verification</h3>
        <div className={`px-2 py-1 text-xs rounded-full ${
          isVerifying ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
        }`}>
          {isVerifying ? "In Progress" : "Complete"}
        </div>
      </div>

      <Progress value={verificationStage * 25} className="h-2 mb-4" />

      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div
            key={index}
            className="flex items-center text-sm"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
              index <= verificationStage ? "bg-primary text-white" : "bg-neutral-200 text-neutral-500"
            }`}>
              {stage.icon}
            </div>
            <span className={index <= verificationStage ? "text-neutral-900" : "text-neutral-500"}>
              {stage.label}
            </span>
            {index === verificationStage && isVerifying && (
              <span className="ml-2 text-yellow-600 text-xs animate-pulse">Processing...</span>
            )}
            {index < verificationStage && (
              <span className="ml-2 text-green-600 text-xs">Completed</span>
            )}
          </div>
        ))}
      </div>

      {txHash && (
        <div className="mt-4 p-3 bg-neutral-100 rounded border text-xs">
          <div className="mb-1 font-medium">Transaction Hash</div>
          <div className="font-mono break-all">{txHash}</div>
          {confirmations > 0 && (
            <div className="mt-2 text-green-600">
              {confirmations} {confirmations === 1 ? "confirmation" : "confirmations"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CaseFilingForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // Fetch departments from backend
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        } else {
          console.error('Failed to fetch departments:', response.status);
          toast({
            title: "Error Fetching Departments",
            description: "Failed to retrieve department list.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
          toast({
            title: "Error Fetching Departments",
            description: "An unexpected error occurred while fetching departments.",
            variant: "destructive",
          });
      }
    };

    fetchDepartments();
  }, [toast]);

  const getDepartmentLabel = (dept: string) => {
    switch (dept) {
      case "ED": return "Enforcement Directorate";
      case "FIU": return "Financial Intelligence Unit";
      case "I4C": return "Indian Cybercrime Coordination Centre";
      case "IT": return "Income Tax Department";
      case "VASP": return "Virtual Asset Service Provider";
      case "BANK": return "Banking Institution";
      default: return dept;
    }
  };

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      reportedBy: "",
      status: "active",
      priority: "medium",
      estimatedLoss: 0,
      assignedDepartment: "",
      initiatorDepartment: "",
      confirmerDepartment: "",
      walletAddress: "",
      transactionHash: ""
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (values: CaseFormValues) => {
      try {
        const response = await fetch('/api/cases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `Failed to create case: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error('Case creation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      toast({
        title: "Case Created Successfully",
        description: `Case ${data.caseId} has been assigned to ${data.assignedTo}`,
        variant: "success",
      });
      form.reset();
      setVerificationStage(0);
      setTxHash(null);
      setConfirmations(0);
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast({
        title: "Case Creation Successful",
        description: "New case has been created and assigned successfully",
        variant: "success",
      });
    },
  });

  const onSubmit = (data: CaseFormValues) => {
    setIsSubmitting(true);
    const submissionData = {
      ...data,
      assignedTo: data.assignedDepartment
    };
    createCaseMutation.mutate(submissionData);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>File New Case</CardTitle>
        <CardDescription>Submit a new cryptocurrency fraud case</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case title" {...field} disabled={isSubmitting}/>
                  </FormControl>
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
                      placeholder="Describe the case"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reportedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reported By</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of reporter" {...field} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Loss (INR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount in INR"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignedDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {getDepartmentLabel(dept)}
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initiatorDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiator Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select initiator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {getDepartmentLabel(dept)}
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
                name="confirmerDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select confirmer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {getDepartmentLabel(dept)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter wallet address" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Hash</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter transaction hash" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Case <ArrowRight className="ml-2 h-4 w-4" />
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

export default CaseFilingForm;