"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function CTA() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleStartStudying = () => {
    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/auth/register")
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Stop Wasting Time Figuring Out{" "}
              <span className="text-primary">What to Study</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let AI plan it for you. Join thousands of students who have already transformed their study habits.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 group"
              onClick={handleStartStudying}
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {session ? "Continue Studying" : "Start Studying Now"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              7-day free trial
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Cancel anytime
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
