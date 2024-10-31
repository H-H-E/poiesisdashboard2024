import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const plenaryFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  session_date: z.date({
    required_error: "Session date is required",
  }),
  points_awarded: z.number().min(0).max(100).optional(),
  student_id: z.string().uuid().optional(),
  pathway_id: z.string().uuid().optional(),
})

type PlenaryFormValues = z.infer<typeof plenaryFormSchema>

interface PlenaryFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function PlenaryForm({ onSuccess, onCancel }: PlenaryFormProps) {
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<PlenaryFormValues>({
    resolver: zodResolver(plenaryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      points_awarded: 0,
    },
  })

  const onSubmit = async (data: PlenaryFormValues) => {
    try {
      const { error } = await supabase
        .from("plenaries")
        .insert({
          title: data.title,
          description: data.description,
          session_date: data.session_date.toISOString(),
          points_awarded: data.points_awarded,
          student_id: data.student_id,
          pathway_id: data.pathway_id,
        })

      if (error) throw error

      toast({ title: "Plenary created successfully" })
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="session_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Session Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="points_awarded"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Awarded</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Create Plenary</Button>
        </div>
      </form>
    </Form>
  )
}