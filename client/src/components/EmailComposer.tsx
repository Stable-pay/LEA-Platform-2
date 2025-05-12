
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EmailFormData {
  to: string;
  subject: string;
  body: string;
  caseId?: string;
}

export const EmailComposer = ({ caseId, department }: { caseId?: string, department: string }) => {
  const [isDraft, setIsDraft] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<EmailFormData>();

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
          <div>
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
