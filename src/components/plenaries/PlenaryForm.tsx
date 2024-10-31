import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
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
  work_url: z.string().url("Please enter a valid URL").optional(),
  session_date: z.date({
    required_error: "Session date is required",
  }),
  points_awarded: z.number().min(0).max(10),
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
      work_url: "",
      points_awarded: 5,
    },
  })

  const onSubmit = async (data: PlenaryFormValues) => {
    try {
      const { error } = await supabase
        .from("plenaries")
        .insert({
          title: data.title,
          description: data.description,
          work_url: data.work_url,
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
          name="work_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
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
              <FormLabel>Points Awarded (0-10)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                    className="w-[60%]"
                  />
                  <span className="w-12 text-center">{field.value}</span>
                </div>
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