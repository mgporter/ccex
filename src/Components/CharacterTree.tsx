import { useEffect, useRef } from "react";
import { ChineseCharacter, ComponentStub } from "../Api/types";


const TREE_CONTAINER_STYLE = `relative z-10`;
const ROW_CONTAINER_STYLE = `flex min-w-[3rem] gap-6 justify-center`;
const BRANCH_CONTAINER_STYLE = `flex flex-col gap-6`;
const COMPONENT_CONTAINER_STYLE = "";
const COMPONENT_BOX_STYLE = "flex items-center justify-center text-[2rem] border-2 size-[4rem] shadow-lg select-none cursor-pointer";
const COMPONENT_PINYIN_STYLE = "text-lg text-center";
const CANVAS_STYLE = "absolute z-5 inset-0 size-full";

// Use these for colors and other mutually exclusive stylings
const COMPONENT_BOX_DEFAULT_STYLE = "border-orange-400 bg-orange-50";
const COMPONENT_BOX_INACTIVE_STYLE = "border-stone-400 bg-stone-100";
const COMPONENT_BOX_ROOT_STYLE = "border-violet-500 bg-violet-50";
// const COMPONENT_BOX_DERIVATIVE_STYLE = "";


interface ComponentWithChildren {
  component: ComponentStub;
  children: number[];
  div: HTMLDivElement;
  parentIndex: number;
}

const NOPARENT = "";

function createComponentWithChildrenArray(chardata: ChineseCharacter) {

  const root: ComponentStub = {
    char: chardata.char,
    pinyin: chardata.primaryPinyin,
    frequency: chardata.frequency,
    parent: NOPARENT,  // The empty string signifies this is the root
  }

  const componentsRaw = [root, ...chardata.components];

  // The null div will be overwritten in the next steps!
  const components: ComponentWithChildren[] = componentsRaw.map(c => ({ component: c, children: [], div: null!, parentIndex: 0 }));

  const parentToIndex: Record<string, number> = {};

  components.forEach((component, i, arr) => {
    parentToIndex[component.component.char] = i;
    const parentIndex = parentToIndex[component.component.parent];
    if (parentIndex != undefined) {
      arr[parentIndex].children.push(i);
      arr[i].parentIndex = parentIndex;
    }
  });

  return components;

}

function createTreeDiv(components: ComponentWithChildren[]): HTMLDivElement {
  const treeDiv = createBoxRecursive(0, components);
  treeDiv.className = BRANCH_CONTAINER_STYLE + " " + TREE_CONTAINER_STYLE;
  return treeDiv;
}

function createBoxRecursive(componentIndex: number, components: ComponentWithChildren[]): HTMLDivElement {

  const component = components[componentIndex].component;
  const children = components[componentIndex].children;

  components[componentIndex].div = createCompBoxDiv(component);

  const parentRow = createRowBoxDiv();
  parentRow.appendChild(components[componentIndex].div);

  const branchBox = createbranchBoxDiv();
  branchBox.appendChild(parentRow);

  if (children.length > 0) {
    const childrenRow = createRowBoxDiv();

    for (const childIndex of children) {
      const childBox = createBoxRecursive(childIndex, components);
      childrenRow.appendChild(childBox);
    }

    branchBox.appendChild(childrenRow);

  }

  return branchBox;
}


function createCompBoxDiv(component: ComponentStub) {

  const parent = document.createElement("div");
  parent.className = COMPONENT_CONTAINER_STYLE;
  parent.setAttribute("data-char", component.char);
  
  const character = document.createElement("div");
  const characterContent = document.createElement("p");
  characterContent.textContent = component.char;
  character.appendChild(characterContent);

  character.onclick = () => {
    console.log("clicked on " + component.char);
  }

  if (component.parent === NOPARENT) {
    character.className = COMPONENT_BOX_STYLE + " " + COMPONENT_BOX_ROOT_STYLE;
  } else {

    if (component.frequency > 10) {
      character.className = COMPONENT_BOX_STYLE + " " + COMPONENT_BOX_DEFAULT_STYLE;
    } else {
      character.className = COMPONENT_BOX_STYLE + " " + COMPONENT_BOX_INACTIVE_STYLE;
    }

  }

  const pinyin = document.createElement("p");
  pinyin.textContent = component.pinyin.join(", ");
  pinyin.className = COMPONENT_PINYIN_STYLE;

  parent.append(character, pinyin);
  
  return parent;
}


function createRowBoxDiv() {
  const div = document.createElement("div");
  div.className = ROW_CONTAINER_STYLE;
  return div;
}

function createbranchBoxDiv() {
  const div = document.createElement("div");
  div.className = BRANCH_CONTAINER_STYLE;
  return div;
}

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.className = CANVAS_STYLE;
  return canvas;
}


function drawAndScaleCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  canvasRect: DOMRect,
  components: ComponentWithChildren[],
) {
  scaleCanvas(canvas, ctx, canvasRect);

  for (const component of components) {
    for (const childIndex of component.children) {
      drawConnection(ctx, component, components[childIndex]);
    }
  }
}

function scaleCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasRect: DOMRect): void {
  let dpr = window.devicePixelRatio;
  dpr *= 2;  // For higher resolutions, we need to bump up the scaling to keep it clear
  canvas.width = canvasRect.width * dpr;
  canvas.height = canvasRect.height * dpr;
  ctx.scale(dpr, dpr);
}


function drawConnection(
  ctx: CanvasRenderingContext2D,
  parent: ComponentWithChildren,
  child: ComponentWithChildren
): void {

  /**
   * Connections are drawn like this:
   * 
   *       parent
   *          |   -> parentStem (start to connectorParentPt)
   *     -----    -> connector (connectorParentPt to connectorChildPt)
   *    |         -> childStem (connectorChildPt to end)
   *  child
   * 
   */

  const startX = parent.div.offsetLeft + (parent.div.offsetWidth / 2);
  const startY = parent.div.offsetTop + parent.div.offsetHeight;
  const endX = child.div.offsetLeft + (child.div.offsetWidth / 2);
  const endY = child.div.offsetTop + 6; // add a bit extra to make sure the line extends under the box

  const gap = endY - startY;

  const connectorParentPtX = startX;
  const connectorParentPtY = startY + (gap / 2) - 1; // -1 is slight compensation for the +6 added above
  const connectorChildPtX = endX;
  const connectorChildPtY = endY - (gap / 2) - 1; // -1 is slight compensation for the +6 added above

  ctx.beginPath();
  ctx.strokeStyle = "#65a30d";
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'butt';

  ctx.moveTo(startX, startY);
  ctx.lineTo(connectorParentPtX, connectorParentPtY);
  ctx.lineTo(connectorChildPtX, connectorChildPtY);
  ctx.lineTo(endX, endY);

  ctx.stroke();

}










export interface CharacterTreeProps {
  chineseCharacter: ChineseCharacter;
}

export default function CharacterTree({ chineseCharacter }: CharacterTreeProps) {

  const containerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const components = createComponentWithChildrenArray(chineseCharacter);

  useEffect(() => {
    const treeDiv = createTreeDiv(components);
    const treeCanvas = createCanvas();

    containerRef.current.appendChild(treeCanvas);
    containerRef.current.appendChild(treeDiv);

    canvasRef.current = treeCanvas;
    ctxRef.current = canvasRef.current.getContext("2d");

    const onResize = () => {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      if (ctxRef.current != null) {
        drawAndScaleCanvas(canvasRef.current, ctxRef.current, canvasRect, components);
      }
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {

      try {
        containerRef.current.removeChild(treeDiv);
        containerRef.current.removeChild(treeCanvas); // eslint-disable-line react-hooks/exhaustive-deps
      } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Do nothing;
      } finally {
        window.removeEventListener("resize", onResize);
      }

    }
  }, [components])

  return (
    <div id="tree" data-rootchar={chineseCharacter.char} ref={containerRef} className="relative" />
  )
};