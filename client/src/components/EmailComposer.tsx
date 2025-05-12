
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

interface EmailFormData {
  to: string;
  subject: string;
  body: string;
  caseId?: string;
}

export const EmailComposer = ({ caseId, department }: { caseId?: string, department: string }) => {
  const [isDraft, setIsDraft] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch } = useForm<EmailFormData>();

  const generateEmailContent = async () => {
    const subject = watch('subject');
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
        }),
      });

      if (!response.ok) throw new Error('Failed to generate email');
      
      const { content } = await response.json();
      setValue('body', content);
      
      toast({
        title: "Email Generated",
        description: "AI has generated email content based on your subject",
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
        body: JSON.stringify({ ...data, caseId, department }),
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
    <Card>
      <CardHeader>
        <CardTitle>Compose Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('to')}
              placeholder="To"
              type="email"
              required
            />
          </div>
          <div>
            <Input
              {...register('subject')}
              placeholder="Subject"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateEmailContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              {...register('body')}
              placeholder="Email body"
              required
              rows={6}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDraft(true);
                handleSubmit(onSubmit)();
              }}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              onClick={() => setIsDraft(false)}
              disabled={sendEmail.isPending}
            >
              {sendEmail.isPending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
