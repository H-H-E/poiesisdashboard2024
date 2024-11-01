"use client"

import React, { useState, useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  NodeTypes,
  Connection,
  MarkerType,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Book, FileText, Folder, ChevronRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

const PathwayNode = ({ data }) => (
  <div className={`p-4 rounded-lg shadow-md ${data.color} w-48`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Book className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">{data.label}</h3>
      </div>
      <ChevronRight className={`w-6 h-6 transition-transform ${data.isExpanded ? 'rotate-90' : ''}`} />
    </div>
    <p className="text-sm text-gray-600 mt-2">{data.description}</p>
  </div>
)

const ProjectNode = ({ data }) => (
  <div className="bg-orange-100 p-4 rounded-md shadow-md w-48">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Folder className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">{data.label}</h3>
      </div>
      <ChevronRight className={`w-6 h-6 transition-transform ${data.isExpanded ? 'rotate-90' : ''}`} />
    </div>
    <p className="text-sm text-gray-600 mt-2">Due: {data.dueDate}</p>
    <Progress value={data.progress} className="mt-2" />
  </div>
)

const PlenaryNode = ({ data }) => (
  <div className="bg-green-100 p-4 rounded-md shadow-md w-48">
    <FileText className="w-6 h-6 mb-2" />
    <h3 className="text-lg font-semibold">{data.label}</h3>
    <p className="text-sm text-gray-600">{data.date}</p>
  </div>
)

const nodeTypes: NodeTypes = {
  pathway: PathwayNode,
  project: ProjectNode,
  plenary: PlenaryNode,
}

const initialNodes: Node[] = [
  { id: '1', type: 'pathway', position: { x: 0, y: 0 }, data: { label: 'Math Pathway', description: 'Advanced Mathematics', color: 'bg-blue-100', isExpanded: false }, sourcePosition: Position.Right },
  { id: '2', type: 'pathway', position: { x: 0, y: 200 }, data: { label: 'Science Pathway', description: 'Physical Sciences', color: 'bg-green-100', isExpanded: false }, sourcePosition: Position.Right },
  { id: '3', type: 'pathway', position: { x: 0, y: 400 }, data: { label: 'Literature Pathway', description: 'English Literature', color: 'bg-yellow-100', isExpanded: false }, sourcePosition: Position.Right },
]

const hiddenNodes: Node[] = [
  { id: '4', type: 'project', position: { x: 300, y: -50 }, data: { label: 'Algebra Project', dueDate: '2023-09-15', progress: 75, isExpanded: false }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '5', type: 'project', position: { x: 300, y: 100 }, data: { label: 'Geometry Project', dueDate: '2023-10-01', progress: 50, isExpanded: false }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '6', type: 'plenary', position: { x: 600, y: -75 }, data: { label: 'Algebra Review', date: '2023-09-01' }, targetPosition: Position.Left },
  { id: '7', type: 'plenary', position: { x: 600, y: 25 }, data: { label: 'Geometry Basics', date: '2023-09-20' }, targetPosition: Position.Left },
  
  { id: '8', type: 'project', position: { x: 300, y: 150 }, data: { label: 'Physics Project', dueDate: '2023-09-25', progress: 30, isExpanded: false }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '9', type: 'project', position: { x: 300, y: 300 }, data: { label: 'Chemistry Project', dueDate: '2023-10-10', progress: 0, isExpanded: false }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '10', type: 'plenary', position: { x: 600, y: 125 }, data: { label: 'Physics Basics', date: '2023-09-05' }, targetPosition: Position.Left },
  { id: '11', type: 'plenary', position: { x: 600, y: 225 }, data: { label: 'Chemistry Intro', date: '2023-09-30' }, targetPosition: Position.Left },
  
  { id: '12', type: 'project', position: { x: 300, y: 350 }, data: { label: 'Shakespeare Project', dueDate: '2023-10-20', progress: 20, isExpanded: false }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '13', type: 'project', position: { x: 300, y: 500 }, data: { label: 'Poetry Project', dueDate: '2023-11-05', progress: 0, isExpanded: false }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: '14', type: 'plenary', position: { x: 600, y: 325 }, data: { label: 'Shakespeare Intro', date: '2023-10-01' }, targetPosition: Position.Left },
  { id: '15', type: 'plenary', position: { x: 600, y: 425 }, data: { label: 'Poetry Analysis', date: '2023-10-15' }, targetPosition: Position.Left },
]

const pathwayEdges: Edge[] = [
  { id: 'e1-4', source: '1', target: '4', type: 'smoothstep', animated: true, style: { stroke: '#93c5fd' } },
  { id: 'e1-5', source: '1', target: '5', type: 'smoothstep', animated: true, style: { stroke: '#93c5fd' } },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-7', source: '5', target: '7', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  
  { id: 'e2-8', source: '2', target: '8', type: 'smoothstep', animated: true, style: { stroke: '#86efac' } },
  { id: 'e2-9', source: '2', target: '9', type: 'smoothstep', animated: true, style: { stroke: '#86efac' } },
  { id: 'e8-10', source: '8', target: '10', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e9-11', source: '9', target: '11', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  
  { id: 'e3-12', source: '3', target: '12', type: 'smoothstep', animated: true, style: { stroke: '#fde047' } },
  { id: 'e3-13', source: '3', target: '13', type: 'smoothstep', animated: true, style: { stroke: '#fde047' } },
  { id: 'e12-14', source: '12', target: '14', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e13-15', source: '13', target: '15', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
]

export function PathwayExplorer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, clickedNode: Node) => {
    if (clickedNode.type === 'pathway') {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isExpanded: n.id === clickedNode.id ? !n.data.isExpanded : false,
          },
        }))
      )

      const isExpanding = !clickedNode.data.isExpanded
      
      if (isExpanding) {
        const childNodes = hiddenNodes.filter((hn) => 
          pathwayEdges.some((e) => e.source === clickedNode.id && e.target === hn.id)
        )
        const childEdges = pathwayEdges.filter((e) => 
          e.source === clickedNode.id || childNodes.some((cn) => cn.id === e.source)
        )
        
        setNodes((nds) => [
          ...nds.filter((n) => initialNodes.some((in_) => in_.id === n.id)),
          ...childNodes
        ])
        setEdges(childEdges)
      } else {
        setNodes((nds) => nds.filter((n) => initialNodes.some((in_) => in_.id === n.id)))
        setEdges([])
      }
    }
  }, [setNodes, setEdges])

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'pathway':
                return node.data.color.replace('bg-', '')
              case 'project':
                return 'orange-100'
              case 'plenary':
                return 'green-100'
              default:
                return '#e2e8f0'
            }
          }}
        />
        <Background color="#aaaaaa" gap={16} />
      </ReactFlow>
    </div>
  )
}
