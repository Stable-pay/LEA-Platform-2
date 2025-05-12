
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Send, Save, Wand2, Lock, FileText, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailFormData {
  to: string;
  subject: string;
  body: string;
  classification?: string;
  template?: string;
  caseId?: string;
  recipients?: string[];
}

const EMAIL_TEMPLATES = {
  'case_update': 'Case Status Update Template',
  'evidence_request': 'Evidence Request Template',
  'intel_sharing': 'Intelligence Sharing Template',
  'coordination': 'Inter-Department Coordination',
  'court_submission': 'Court Submission Draft'
};

const CLASSIFICATIONS = {
  'confidential': 'Confidential',
  'restricted': 'Restricted',
  'top_secret': 'Top Secret',
  'internal': 'Internal Only'
};

export default function EmailComposer({ caseId, department }: { caseId?: string; department: string }) {
  const [isDraft, setIsDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch } = useForm<EmailFormData>();

  const generateEmailContent = async () => {
    const subject = watch('subject');
    const template = watch('template');
    
    if (!subject) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          caseId,
          department,
          template,
          classification: watch('classification')
        }),
      });

      if (!response.ok) throw new Error('Failed to generate email');
      
      const { content } = await response.json();
      setValue('body', content);
      
      toast({
        title: "Email Generated",
        description: "AI has generated specialized LEA email content",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate email content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = useMutation({
    mutationFn: async (data: EmailFormData) => {
      const endpoint = isDraft ? '/api/emails/draft' : '/api/emails/send';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...data, 
          caseId, 
          department,
          classification: data.classification || 'internal'
        }),
      });
      if (!response.ok) throw new Error('Failed to process email');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isDraft ? "Draft Saved" : "Email Sent",
        description: isDraft ? "Your draft has been saved" : "Email sent successfully",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmailFormData) => {
    sendEmail.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          LEA Secure Communication
        </CardTitle>
        <CardDescription>
          Compose secure inter-department communications with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select onValueChange={(value) => setValue('classification', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Classification Level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASSIFICATIONS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {value}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select onValueChange={(value) => {
                setSelectedTemplate(value);
                setValue('template', value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EMAIL_TEMPLATES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {value}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                {...register('to')}
                placeholder="To"
                type="email"
                required
                className="w-full"
              />
            </div>
            <div className="flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => {/* Add recipient selector */}}
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Input
            {...register('subject')}
            placeholder="Subject"
            required
            className="w-full"
          />

          <div className="space-y-2">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateEmailContent}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register('body')}
              placeholder="Email body"
              required
              rows={12}
              className="w-full font-mono text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDraft(true);
                handleSubmit(onSubmit)();
              }}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="submit"
              onClick={() => setIsDraft(false)}
              disabled={sendEmail.isPending}
              className="gap-2"
            >
              {sendEmail.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Secure Email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
