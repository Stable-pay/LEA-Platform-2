import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
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
  transactionHash: z.string().min(1, "Transaction Hash is required"),
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
  const { user, login } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [caseId, setCaseId] = useState<string | null>(null);

  useEffect(() => {
    if (!isVerifying) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.hostname}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message:", data);

        if (data.type === "TRANSACTION_CONFIRMED" && data.data.entityType === "case" && data.data.entityId === caseId) {
          setVerificationStage(3);
          setConfirmations(1);
          setIsVerifying(false);

          toast({
            title: "Case Verified on Blockchain",
            description: "Your case has been successfully verified by all network nodes.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("WebSocket error:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [isVerifying, caseId, toast]);

  const nodes = [
    { id: "ED", name: "Enforcement Directorate" },
    { id: "FIU", name: "Financial Intelligence Unit" },
    { id: "I4C", name: "Indian Cybercrime Coordination Centre" },
    { id: "IT", name: "Income Tax Department" }
  ];

  useEffect(() => {
    if (!isVerifying) return;

    const interval = setInterval(() => {
      setVerificationStage((stage) => {
        const next = stage + 1;
        if (next >= 3) {
          clearInterval(interval);
        }
        return next < 3 ? next : 2;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isVerifying]);

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      reportedBy: user?.fullName || "",
      status: "active",
      priority: "medium",
      estimatedLoss: 0,
      assignedDepartment: "ED",
      initiatorDepartment: "ED",
      confirmerDepartment: "ED",
      walletAddress: "",
      transactionHash: ""
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (values: CaseFormValues) => {
      const caseData = {
        title: values.title,
        description: values.description,
        reportedBy: user?.fullName || values.reportedBy,
        status: values.status || "active",
        priority: values.priority || "medium",
        estimatedLoss: Number(values.estimatedLoss),
        assignedDepartment: values.assignedDepartment,
        initiatorDepartment: values.initiatorDepartment,
        confirmerDepartment: values.confirmerDepartment,
        walletAddress: values.walletAddress,
        transactionHash: values.transactionHash
      };

      console.log("Submitting case:", caseData);

      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(caseData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create case');
      }
      
      return response.json();
    },

      const apiResponse = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseData),
      });

      if (!apiResponse.ok) {
        const error = await apiResponse.json();
        throw new Error(error.message || 'Failed to create case');
      }

      return apiResponse.json();
    },
    onSuccess: (data, values) => {
      setIsSubmitting(false);
      setCaseId(data.id.toString());

      setIsVerifying(true);
      setVerificationStage(0);

      const mockId = Date.now().toString().slice(-4);
      setTxHash(`0x${Math.random().toString(16).slice(2)}`);

      const caseData = {
        ...values,
        id: mockId,
        caseId: `CASE-${mockId}`,
        createdAt: new Date().toISOString(),
        verifiedOnBlockchain: true,
        department: values.assignedDepartment,
        status: values.status || "active"
      };

      const newCaseEvent = new CustomEvent('new-case-filed', { detail: caseData });
      const caseManagementEvent = new CustomEvent('case-management-update', { detail: caseData });

      window.dispatchEvent(newCaseEvent);
      window.dispatchEvent(caseManagementEvent);

      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      toast({
        title: "Case Created",
        description: `Case ${mockId} has been created successfully.`,
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Case creation error:", error);
      setIsSubmitting(false);
      toast({
        title: "Error Creating Case",
        description: error.message || "Failed to create case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CaseFormValues) => {
    setIsSubmitting(true);
    createCaseMutation.mutate(data);
  };

  const startBlockchainVerification = async (caseId: number) => {
    try {
      setIsVerifying(true);
      setVerificationStage(0);

      const res = await fetch("/api/blockchain/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType: "case",
          entityId: caseId.toString(),
          action: "create",
          sourceNodeId: "stable-pay-node",
          metadata: {
            verifiedBy: user?.fullName,
            role: user?.role,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const txData = await res.json();
      setTxHash(txData.txHash);

    } catch (error) {
      console.error("Blockchain verification error:", error);
      toast({
        title: "Verification Error",
        description: "Failed to verify case on blockchain",
        variant: "destructive",
      });
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setIsVerifying(false);
    setVerificationStage(0);
    setTxHash(null);
    setConfirmations(0);
    setCaseId(null);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>File New Fraud Case</CardTitle>
        <CardDescription>
          Create a new cryptocurrency fraud case with blockchain verification
        </CardDescription>
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
                    <Input placeholder="Enter case title" {...field} disabled={isSubmitting || isVerifying}/>
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
                      placeholder="Describe the case in detail"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isSubmitting || isVerifying}
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
                      <Input placeholder="Name of reporter" {...field} disabled={isSubmitting || isVerifying}/>
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
                        disabled={isSubmitting || isVerifying}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || isVerifying}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ED">Enforcement Directorate</SelectItem>
                          <SelectItem value="FIU">Financial Intelligence Unit</SelectItem>
                          <SelectItem value="I4C">Indian Cybercrime Coordination Centre</SelectItem>
                          <SelectItem value="IT">Income Tax Department</SelectItem>
                          <SelectItem value="VASP">Virtual Asset Service Provider</SelectItem>
                          <SelectItem value="BANK">Banking Institution</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initiatorDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Initiator</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || isVerifying}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select initiator" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ED">Enforcement Directorate</SelectItem>
                          <SelectItem value="FIU">Financial Intelligence Unit</SelectItem>
                          <SelectItem value="I4C">Indian Cybercrime Coordination Centre</SelectItem>
                          <SelectItem value="IT">Income Tax Department</SelectItem>
                          <SelectItem value="VASP">Virtual Asset Service Provider</SelectItem>
                          <SelectItem value="BANK">Banking Institution</SelectItem>
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
                      <FormLabel>Task Confirmer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || isVerifying}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select confirmer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ED">Enforcement Directorate</SelectItem>
                          <SelectItem value="FIU">Financial Intelligence Unit</SelectItem>
                          <SelectItem value="I4C">Indian Cybercrime Coordination Centre</SelectItem>
                          <SelectItem value="IT">Income Tax Department</SelectItem>
                          <SelectItem value="VASP">Virtual Asset Service Provider</SelectItem>
                          <SelectItem value="BANK">Banking Institution</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || isVerifying}>
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || isVerifying}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
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
                    <Input placeholder="Enter wallet address" {...field} disabled={isSubmitting || isVerifying}/>
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
                    <Input placeholder="Enter transaction hash" {...field} disabled={isSubmitting || isVerifying}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting || isVerifying}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isVerifying}
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

        {(isVerifying || confirmations > 0) && (
          <BlockchainVerification
            isVerifying={isVerifying}
            verificationStage={verificationStage}
            txHash={txHash}
            confirmations={confirmations}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CaseFilingForm;