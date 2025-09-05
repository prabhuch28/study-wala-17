"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, BarChart3, RotateCcw } from "lucide-react"

export function Demo() {
  return (
    <section id="demo" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            See Study-Wala in <span className="text-primary">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience how our AI transforms your syllabus into effective study materials
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Study Guide
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Data Structures & Algorithms - Chapter 3
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Binary Trees</Badge>
                    <Badge variant="secondary">Traversal</Badge>
                    <Badge variant="secondary">BST</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Concepts</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Binary Tree structure and properties</li>
                      <li>• In-order, Pre-order, Post-order traversals</li>
                      <li>• Binary Search Tree operations</li>
                      <li>• Time complexity analysis: O(log n) vs O(n)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Study Notes</h3>
                    <p className="text-muted-foreground">
                      A binary tree is a hierarchical data structure where each node has at most two children. 
                      The left subtree contains nodes with values less than the parent, while the right subtree 
                      contains nodes with values greater than the parent...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flashcards">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-br from-primary/10 to-muted/20 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">What is the time complexity of searching in a balanced BST?</h3>
                        <Button variant="outline" className="mt-4">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reveal Answer
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Card 3 of 15</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Hard</Button>
                        <Button variant="outline" size="sm">Good</Button>
                        <Button size="sm">Easy</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Binary Trees</span>
                        <span className="text-primary">85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Graph Algorithms</span>
                        <span className="text-primary">60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Dynamic Programming</span>
                        <span className="text-primary">40%</span>
                      </div>
                      <Progress value={40} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">24</div>
                        <div className="text-sm text-muted-foreground">Hours Studied</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">156</div>
                        <div className="text-sm text-muted-foreground">Cards Reviewed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-sm text-muted-foreground">Quizzes Taken</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">89%</div>
                        <div className="text-sm text-muted-foreground">Avg Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
