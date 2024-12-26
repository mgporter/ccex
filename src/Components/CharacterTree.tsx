import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { ChineseCharacterTreeMapDTO, ComponentStub } from "../Api/types";
import { ccexDispatcher } from "../Utils/CCEXDispatcher";


const TREE_CONTAINER_STYLE = `relative z-10`;
const ROW_CONTAINER_STYLE = `component-row flex min-w-[3rem] gap-6 justify-center lg:gap-2`;
const BRANCH_CONTAINER_STYLE = `component-branch flex flex-col gap-6`;
const COMPONENT_CONTAINER_STYLE = "flex flex-col items-center";
const COMPONENT_BOX_STYLE = "component-box noto-serif-sc flex items-center justify-center text-[2rem] border-2 size-[4rem] shadow-lg select-none cursor-pointer";
const COMPONENT_PINYIN_STYLE = "text-lg text-center";
const CANVAS_STYLE = "absolute z-5 inset-0 size-full";

// Use these for colors and other mutually exclusive stylings
const COMPONENT_BOX_DEFAULT_STYLE = "border-orange-400 bg-orange-50 hover:border-orange-500 hover:bg-orange-100 active:border-orange-700 active:bg-orange-300";
const COMPONENT_BOX_INACTIVE_STYLE = "border-stone-400 bg-stone-100 hover:border-stone-500 hover:bg-stone-200 active:border-stone-700 active:bg-stone-400";
const COMPONENT_BOX_ROOT_STYLE = "component-root border-violet-500 bg-violet-50 hover:border-violet-600 hover:bg-violet-100 active:border-violet-800 active:bg-violet-300";
// const COMPONENT_BOX_DERIVATIVE_STYLE = "";


interface ComponentWithChildren {
  component: ComponentStub;
  children: number[];
  div: HTMLDivElement;
  parentIndex: number;
}

const NOPARENT = "";

function createComponentWithChildrenArray(chardata: ChineseCharacterTreeMapDTO) {

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

  const componentBox = createCompBoxDiv(component);

  components[componentIndex].div = componentBox;

  const parentRow = createRowBoxDiv();
  parentRow.appendChild(componentBox);

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
  
  const characterBox = document.createElement("div");
  characterBox.setAttribute("data-char", component.char);
  characterBox.onclick = () => ccexDispatcher.dispatch("showCharDetails", component.char);

  const character = document.createElement("p");
  character.textContent = component.char;
  characterBox.appendChild(character);

  if (component.parent === NOPARENT) {
    characterBox.className = COMPONENT_BOX_STYLE + " " + COMPONENT_BOX_ROOT_STYLE;
  } else {

    if (component.frequency > 10) {
      characterBox.className = COMPONENT_BOX_STYLE + " " + COMPONENT_BOX_DEFAULT_STYLE;
    } else {
      characterBox.className = COMPONENT_BOX_STYLE + " " + COMPONENT_BOX_INACTIVE_STYLE;
    }

  }

  const pinyin = document.createElement("p");
  pinyin.textContent = component.pinyin.join(", ");
  pinyin.className = COMPONENT_PINYIN_STYLE;

  parent.append(characterBox, pinyin);
  
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
  chineseCharacter: ChineseCharacterTreeMapDTO;
}

export default function CharacterTree({ chineseCharacter }: CharacterTreeProps) {

  const containerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const components = useMemo(() => createComponentWithChildrenArray(chineseCharacter), [chineseCharacter]);
  
  const drawAndScaleCanvasCallback = useCallback(() => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    if (ctxRef.current != null) {
      drawAndScaleCanvas(canvasRef.current, ctxRef.current, canvasRect, components);
    }
  }, [components])

  useLayoutEffect(() => {

    const treeDiv = createTreeDiv(components);
    const treeCanvas = createCanvas();

    containerRef.current.appendChild(treeCanvas);
    containerRef.current.appendChild(treeDiv);

    canvasRef.current = treeCanvas;
    ctxRef.current = canvasRef.current.getContext("2d");

    drawAndScaleCanvasCallback();

    window.addEventListener("resize", drawAndScaleCanvasCallback);

    return () => {

      try {
        containerRef.current.removeChild(treeDiv);
        containerRef.current.removeChild(treeCanvas); // eslint-disable-line react-hooks/exhaustive-deps
      } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Do nothing;
      } finally {
        window.removeEventListener("resize", drawAndScaleCanvasCallback);
      }

    }
  }, [components, drawAndScaleCanvasCallback])

  useEffect(() => {

    // If the tree is wider than the screen,
    // then decrease the size of the tree.

    const rect = containerRef.current.getBoundingClientRect();

    if (rect.width > window.innerWidth) {
      const rows = document.querySelectorAll(`[data-rootchar="${chineseCharacter.char}"] .component-row`);

      for (const row of rows) {
        (row as HTMLElement).style.gap = "0.1rem";
        (row as HTMLElement).style.minWidth = "0.1rem";
      }

      const boxes = document.querySelectorAll(`[data-rootchar="${chineseCharacter.char}"] .component-box:not(.component-root)`);

      for (const box of boxes) {
        (box as HTMLElement).style.width = "3rem";
        (box as HTMLElement).style.height = "3rem";
        (box as HTMLElement).style.fontSize = "1.8rem";
      }

      drawAndScaleCanvasCallback();
    }

  }, [chineseCharacter.char, drawAndScaleCanvasCallback])

  return (
      <div id="tree" data-rootchar={chineseCharacter.char} ref={containerRef} 
        className="relative lg:mb-24 lg:first-of-type:mt-24" />
  )
};