import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const standardFormSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  framework_id: z.string().uuid("Please select a framework"),
  grade_level_start: z.coerce.number().min(0).max(12).optional(),
  grade_level_end: z.coerce.number().min(0).max(12).optional(),
})

type StandardFormValues = z.infer<typeof standardFormSchema>

interface StandardFormProps {
  onSuccess?: () => void
}

export function StandardForm({ onSuccess }: StandardFormProps) {
  const { toast } = useToast()

  const { data: frameworks } = useQuery({
    queryKey: ["frameworks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frameworks")
        .select("*")
        .order("name")
      
      if (error) throw error
      return data
    }
  })

  const form = useForm<StandardFormValues>({
    resolver: zodResolver(standardFormSchema),
    defaultValues: {
      code: "",
      description: "",
      framework_id: undefined,
      grade_level_start: undefined,
      grade_level_end: undefined,
    }
  })

  const onSubmit = async (values: StandardFormValues) => {
    try {
      const { error } = await supabase
        .from("educational_standards")
        .insert({
          code: values.code,
          description: values.description,
          framework_id: values.framework_id,
          grade_level_start: values.grade_level_start,
          grade_level_end: values.grade_level_end,
        })

      if (error) throw error

      toast({ title: "Standard created successfully" })
      form.reset()
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., CCSS.MATH.CONTENT.K.CC.A.1" />
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
          name="framework_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Framework</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {frameworks?.map((framework) => (
                    <SelectItem key={framework.id} value={framework.id}>
                      {framework.name} {framework.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="grade_level_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Grade Level</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={12} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade_level_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ending Grade Level</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={12} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit">Create Standard</Button>
        </div>
      </form>
    </Form>
  )
}