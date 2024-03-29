import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  BackgroundVariant,
  DefaultEdgeOptions,
  OnConnectStart,
  OnConnectEnd,
  useReactFlow,
  NodeOrigin,
} from "reactflow";
import { useRef, useCallback } from "react";

import "./Flow.css"
import "reactflow/dist/style.css";
import useNodeEdgeStore from "../Zustand/storeRF";
import { nodeTypes } from "../Zustand/NodesAndEdges";

/// Edge options
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
}

// config node origin to center of node
const nodeOrigin: NodeOrigin = [0.5, 0.5];

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  addNodeDrag: state.addNodeDrag,
});

const Flow = () => {

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeDrag
  } = useNodeEdgeStore(selector)

  const { screenToFlowPosition } = useReactFlow()
  
  /// Handling connection events when users choose to customize flow themselves
  const startNodeId = useRef<string | null>(null);
  
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    startNodeId.current = nodeId;
  }, []);
  
  const onConnectEnd: OnConnectEnd = useCallback((event) => {

    if (startNodeId.current) {
      // console.log(`add new node with parent node ${startNodeId.current}`);
      
      /// Get position based on type of events: MouseEvent (laptop) or TouchEvent (mobile & table)
      const position = event instanceof MouseEvent? 
      screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      }) :
      screenToFlowPosition({
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      })

      addNodeDrag(startNodeId.current, position)
    }
    
    startNodeId.current = null
  }, [screenToFlowPosition]);


  // const onNodeClick = (_evt: any, node: Node) => {
  //   // console.log(node.data.label)
  //   // console.log("Before deletion ", onDelete.current)
  //   if (onDelete.current)
  //   {
  //     deleteNode(node)
  //     onDelete.current = false
  //   }
  //   console.log("After deletion (if at all): ", onDelete.current)
  // } 

  return (
    <div className="flow__container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        zoomOnScroll={false}
        panOnScroll
        nodeTypes={nodeTypes}
        nodeOrigin={nodeOrigin}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
      </ReactFlow>
    </div>

  );
};

export default Flow;
