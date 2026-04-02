/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,g=globalThis,u=g.trustedTypes,f=u?u.emptyScript:"",m=g.reactiveElementPolyfillSupport,$=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!r(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);o?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const a=o.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const a=this.constructor;if(!1===s&&(o=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??v)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[$("elementProperties")]=new Map,x[$("finalized")]=new Map,m?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y=globalThis,_=t=>t,S=y.trustedTypes,z=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+M,k=`<${E}>`,C=document,H=()=>C.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,P="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,W=/>/g,U=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,O=/"/g,N=/^(?:script|style|textarea|title)$/i,R=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=R(1),j=R(2),I=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,Z=C.createTreeWalker(C,129);function K(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,a=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===T?"!--"===l[1]?n=D:void 0!==l[1]?n=W:void 0!==l[2]?(N.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=o??T,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?U:'"'===l[3]?O:G):n===O||n===G?n=U:n===D||n===W?n=T:(n=U,o=void 0);const d=n===U&&t[e+1].startsWith("/>")?" ":"";a+=n===T?i+k:c>=0?(s.push(r),i.slice(0,c)+A+i.slice(c)+M+d):i+M+(-2===c?e:d)}return[K(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,a=0;const n=t.length-1,r=this.parts,[l,c]=J(t,e);if(this.el=Y.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&r.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[a++],i=s.getAttribute(t).split(M),n=/([.?@])?(.*)/.exec(e);r.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?it:"?"===n[1]?st:"@"===n[1]?ot:et}),s.removeAttribute(t)}else t.startsWith(M)&&(r.push({type:6,index:o}),s.removeAttribute(t));if(N.test(s.tagName)){const t=s.textContent.split(M),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],H()),Z.nextNode(),r.push({type:2,index:++o});s.append(t[e],H())}}}else if(8===s.nodeType)if(s.data===E)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(M,t+1));)r.push({type:7,index:o}),t+=M.length-1}o++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===I)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=F(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??C).importNode(e,!0);Z.currentNode=s;let o=Z.nextNode(),a=0,n=0,r=i[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new tt(o,o.nextSibling,this,t):1===r.type?e=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(e=new at(o,this,t)),this._$AV.push(e),r=i[++n]}a!==r?.index&&(o=Z.nextNode(),a++)}return Z.currentNode=C,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),F(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Y(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new tt(this.O(H()),this.O(H()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=_(t).nextSibling;_(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const o=this.strings;let a=!1;if(void 0===o)t=Q(this,t,e,0),a=!F(t)||t!==this._$AH&&t!==I,a&&(this._$AH=t);else{const s=t;let n,r;for(t=o[0],n=0;n<o.length-1;n++)r=Q(this,s[i+n],e,n),r===I&&(r=this._$AH[n]),a||=!F(r)||r!==this._$AH[n],r===V?t=V:t!==V&&(t+=(r??"")+o[n+1]),this._$AH[n]=r}a&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class ot extends et{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===I)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=y.litHtmlPolyfillSupport;nt?.(Y,tt),(y.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new tt(e.insertBefore(H(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}lt._$litElement$=!0,lt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:lt});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:lt}),(rt.litElementVersions??=[]).push("4.2.2");const ht=a`
  @keyframes sc-flicker1 {
    0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.9; }
    25% { transform: scale(1.05) rotate(1deg); opacity: 1; }
    50% { transform: scale(0.95) rotate(-2deg); opacity: 0.85; }
    75% { transform: scale(1.02) rotate(0.5deg); opacity: 0.95; }
  }
  @keyframes sc-flicker2 {
    0%, 100% { transform: scale(0.95) rotate(1deg); opacity: 0.85; }
    30% { transform: scale(1) rotate(-1deg); opacity: 0.95; }
    60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
    80% { transform: scale(0.98) rotate(-0.5deg); opacity: 0.9; }
  }
  @keyframes sc-glow-anim {
    0%, 100% { filter: blur(4px) brightness(1); }
    50% { filter: blur(6px) brightness(1.3); }
  }
  @keyframes sc-twinkle1 { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
  @keyframes sc-twinkle2 { 0%, 100% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 0.9; transform: scale(1.1); } }
  @keyframes sc-twinkle3 { 0%, 100% { opacity: 0.1; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.3); } }
  @keyframes sc-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes sc-pulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
  }

  .sc-melt-candle { display: flex; justify-content: center; }
  .sc-content:not(.sc-two-col) .sc-melt-candle { margin-bottom: 8px; }

  .sc-melt-candle .sc-fl-body {
    animation: sc-flicker1 2.5s ease-in-out infinite;
    transform-origin: center bottom;
  }
  .sc-melt-candle .sc-fl-core {
    animation: sc-flicker2 3s ease-in-out infinite;
    transform-origin: center bottom;
  }
  .sc-melt-candle .sc-fl-glow {
    animation: sc-glow-anim 2.5s ease-in-out infinite;
  }
  .sc-melt-candle .sc-ambient {
    animation: sc-pulse 5s ease-in-out infinite;
  }

  .sc-two-col {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--sc-two-col-gap, 14px);
    align-items: center;
    text-align: left;
    width: 100%;
  }
  .sc-col-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .sc-col-right {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .sc-two-col .sc-title { text-align: left; }
  .sc-two-col .sc-subtitle { text-align: left; }
  .sc-two-col .sc-countdown { text-align: left; letter-spacing: 2px; margin-top: 6px; }
  .sc-two-col .sc-cd-label { text-align: left; }
  .sc-two-col .sc-ring-wrap { justify-content: center; margin: 4px 0; }
  .sc-two-col .sc-times { justify-content: flex-start; }
  .sc-two-col .sc-date { text-align: left; }

  .sc-widget {
    position: relative;
    padding: var(--sc-padding);
    text-align: center;
    min-height: var(--sc-min-height);
    display: flex;
    flex-direction: var(--sc-direction, column);
    align-items: center;
    justify-content: center;
    gap: var(--sc-gap, 0);
    color: var(--sc-text-color, #FFFFFF);
  }
  .sc-content {
    position: relative; z-index: 1;
    width: 100%;
  }
  .sc-content.sc-horizontal {
    display: flex;
    align-items: center;
    gap: 10px;
    width: auto;
    flex-wrap: wrap;
    justify-content: center;
  }
  .sc-bg {
    position: absolute; inset: 0; z-index: 0;
    background: var(--sc-bg);
  }

  .sc-stars { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
  .sc-star {
    position: absolute; color: #FFFDE7;
    text-shadow: 0 0 6px rgba(255,253,231,0.8);
  }
  .sc-star:nth-child(1) { top: 8%; left: 12%; font-size: 16px; animation: sc-twinkle1 3s ease-in-out infinite; }
  .sc-star:nth-child(2) { top: 5%; right: 18%; font-size: 20px; animation: sc-twinkle2 4s ease-in-out infinite 0.5s; }
  .sc-star:nth-child(3) { top: 18%; left: 45%; font-size: 14px; animation: sc-twinkle3 3.5s ease-in-out infinite 1s; }
  .sc-star:nth-child(4) { top: 4%; left: 32%; font-size: 10px; animation: sc-twinkle1 2.8s ease-in-out infinite 1.5s; }
  .sc-star:nth-child(5) { top: 14%; right: 8%; font-size: 12px; animation: sc-twinkle2 3.2s ease-in-out infinite 2s; }
  .sc-star:nth-child(6) { top: 22%; left: 22%; font-size: 11px; animation: sc-twinkle3 4.5s ease-in-out infinite 0.8s; }
  .sc-star:nth-child(7) { top: 10%; left: 68%; font-size: 13px; animation: sc-twinkle1 3.8s ease-in-out infinite 2.5s; }
  .sc-star:nth-child(8) { top: 28%; right: 30%; font-size: 9px; animation: sc-twinkle2 2.5s ease-in-out infinite 1.2s; }
  .sc-star:nth-child(9) { top: 3%; left: 55%; font-size: 15px; animation: sc-twinkle3 3s ease-in-out infinite 0.3s; }

  .sc-hero { font-size: var(--sc-hero-size); margin-bottom: var(--sc-hero-margin); }
  .sc-float { animation: sc-float 4s ease-in-out infinite; }

  .sc-title {
    font-size: var(--sc-title-size); font-weight: 600; margin: 4px 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    animation: sc-float 6s ease-in-out infinite;
  }
  .sc-subtitle {
    font-size: var(--sc-subtitle-size); opacity: 0.85; margin-top: 2px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  .sc-ring-wrap { display: flex; justify-content: center; margin: var(--sc-ring-margin); }
  .sc-ring { position: relative; width: var(--sc-ring-size); height: var(--sc-ring-size); }
  .sc-ring svg { transform: rotate(-90deg); width: var(--sc-ring-size); height: var(--sc-ring-size); }
  .sc-ring-bg { fill: none; stroke: rgba(255,255,255,0.12); stroke-width: var(--sc-ring-stroke); }
  .sc-ring-fg {
    fill: none; stroke: url(#scGold); stroke-width: var(--sc-ring-stroke); stroke-linecap: round;
    animation: sc-pulse 4s ease-in-out infinite;
  }
  .sc-ring-text {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%); text-align: center; line-height: 1.3;
  }
  .sc-ring-pct { font-size: var(--sc-ring-pct-size); font-weight: 300; }
  .sc-ring-lbl { font-size: var(--sc-ring-lbl-size); opacity: 0.5; }

  .sc-countdown { font-size: var(--sc-countdown-size); font-weight: 200; letter-spacing: 3px; margin-top: 10px;
    text-shadow: 0 2px 14px rgba(0,0,0,0.3); }
  .sc-cd-label { font-size: var(--sc-cd-label-size); opacity: 0.55; margin-top: 4px; }

  .sc-times {
    display: flex; justify-content: center; gap: var(--sc-times-gap);
    margin-top: var(--sc-times-margin); font-size: var(--sc-times-size);
  }
  .sc-time-label { font-size: 0.8em; opacity: 0.45; margin-bottom: 3px; }
  .sc-time-val { font-weight: 500; font-size: 1.15em; }

  .sc-date { margin-top: 12px; font-size: var(--sc-date-size); opacity: 0.4; }

  .sc-error {
    padding: 16px;
    text-align: center;
    color: var(--primary-text-color, #333);
  }
  .sc-error-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
`,dt={issurMelacha:"binary_sensor.jewish_calendar_issur_melacha_in_effect",motzei:"binary_sensor.jewish_calendar_motzei_shabbat_hag",candleLighting:"sensor.jewish_calendar_upcoming_candle_lighting",havdalah:"sensor.jewish_calendar_upcoming_havdalah",parsha:"sensor.jewish_calendar_parshat_hashavua",holiday:"sensor.jewish_calendar_holiday",hebrewDate:"sensor.jewish_calendar_date",sun:"sun.sun"},pt={tiny:{cardSize:1,padding:"8px 12px",minHeight:"0",titleSize:"1em",subtitleSize:"0.7em",countdownSize:"1.1em",cdLabelSize:"0.6em",heroSize:"1em",heroMargin:"0",candleGap:"8px",candleH:"28px",flameW:"6px",flameH:"10px",fwW:"8px",fwH:"12px",glowSize:"10px",glowOff:"-2px",stickW:"3px",stickH:"16px",showRing:!1,showTimes:!1,showDate:!1,showStars:!1,showIcon:!1,showSubtitle:!1,showCdLabel:!1,horizontal:!0,timesSize:"0.7em",dateSize:"0.65em",ringSize:60,ringStroke:3,ringPctSize:"0.9em",ringLblSize:"0.5em",ringMargin:"4px 0 2px",timesGap:"14px",timesMargin:"4px"},compact:{cardSize:2,padding:"10px 12px 8px",minHeight:"80px",titleSize:"1.1em",subtitleSize:"0.75em",countdownSize:"1.3em",cdLabelSize:"0.65em",heroSize:"1.4em",heroMargin:"2px",candleGap:"12px",candleH:"36px",flameW:"7px",flameH:"13px",fwW:"9px",fwH:"15px",glowSize:"14px",glowOff:"-2px",stickW:"4px",stickH:"20px",showRing:!1,showTimes:!1,showDate:!1,showStars:!0,showIcon:!0,showSubtitle:!1,showCdLabel:!0,horizontal:!1,twoCol:!0,twoColGap:"10px",timesSize:"0.75em",dateSize:"0.7em",ringSize:70,ringStroke:3,ringPctSize:"1em",ringLblSize:"0.5em",ringMargin:"6px 0 2px",timesGap:"16px",timesMargin:"6px"},small:{cardSize:3,padding:"14px 12px 12px",minHeight:"120px",titleSize:"1.3em",subtitleSize:"0.8em",countdownSize:"1.6em",cdLabelSize:"0.7em",heroSize:"1.8em",heroMargin:"4px",candleGap:"16px",candleH:"50px",flameW:"10px",flameH:"18px",fwW:"12px",fwH:"20px",glowSize:"18px",glowOff:"-3px",stickW:"5px",stickH:"28px",showRing:!0,showTimes:!1,showDate:!1,showStars:!0,showIcon:!0,showSubtitle:!0,showCdLabel:!0,horizontal:!1,twoCol:!0,twoColGap:"14px",timesSize:"0.8em",dateSize:"0.75em",ringSize:80,ringStroke:4,ringPctSize:"1.1em",ringLblSize:"0.55em",ringMargin:"10px 0 4px",timesGap:"20px",timesMargin:"8px"},medium:{cardSize:5,padding:"20px 16px 18px",minHeight:"200px",titleSize:"1.8em",subtitleSize:"1em",countdownSize:"2.1em",cdLabelSize:"0.8em",heroSize:"2.5em",heroMargin:"8px",candleGap:"22px",candleH:"70px",flameW:"13px",flameH:"22px",fwW:"15px",fwH:"26px",glowSize:"24px",glowOff:"-4px",stickW:"6px",stickH:"38px",showRing:!0,showTimes:!0,showDate:!0,showStars:!0,showIcon:!0,showSubtitle:!0,showCdLabel:!0,horizontal:!1,timesSize:"0.85em",dateSize:"0.8em",ringSize:100,ringStroke:5,ringPctSize:"1.4em",ringLblSize:"0.6em",ringMargin:"14px 0 6px",timesGap:"30px",timesMargin:"12px"},large:{cardSize:7,padding:"28px 20px 24px",minHeight:"280px",titleSize:"2.2em",subtitleSize:"1.15em",countdownSize:"2.6em",cdLabelSize:"0.85em",heroSize:"3.2em",heroMargin:"10px",candleGap:"28px",candleH:"90px",flameW:"16px",flameH:"28px",fwW:"18px",fwH:"32px",glowSize:"30px",glowOff:"-6px",stickW:"7px",stickH:"48px",showRing:!0,showTimes:!0,showDate:!0,showStars:!0,showIcon:!0,showSubtitle:!0,showCdLabel:!0,horizontal:!1,timesSize:"0.95em",dateSize:"0.85em",ringSize:130,ringStroke:6,ringPctSize:"1.7em",ringLblSize:"0.7em",ringMargin:"20px 0 10px",timesGap:"40px",timesMargin:"18px"}},gt={large:{svgW:80,svgH:200,bodyW:22,bodyMaxH:110,pad:20,flameH:28,flameW:12,wickH:10,poolRxBase:18,poolGrow:6,bulge:3.5,hlW:3},medium:{svgW:60,svgH:150,bodyW:16,bodyMaxH:75,pad:15,flameH:22,flameW:9,wickH:7,poolRxBase:13,poolGrow:4,bulge:2.5,hlW:2.5},small:{svgW:44,svgH:100,bodyW:12,bodyMaxH:50,pad:10,flameH:16,flameW:7,wickH:5,poolRxBase:10,poolGrow:3,bulge:2,hlW:2},compact:{svgW:32,svgH:70,bodyW:9,bodyMaxH:34,pad:8,flameH:12,flameW:5,wickH:4,poolRxBase:7,poolGrow:2,bulge:1.5,hlW:1.5},tiny:{svgW:22,svgH:44,bodyW:6,bodyMaxH:20,pad:5,flameH:8,flameW:3.5,wickH:3,poolRxBase:5,poolGrow:1.5,bulge:1,hlW:1}},ut={size:"large",preview:"off"},ft={pre_shabbat:{issur:!1,motzei:!1,preShabbat:!0,holiday:"",progress:0,statusText:"שבת שלום",statusSubtitle:"Vayakhel-Pekudei",countdown:"14m",countdownLabel:"Until Shabbat",targetTimeLocal:"Friday 7:42 PM",candleLighting:"7:24 PM",havdalah:"8:20 PM",hebrewDate:"19 Adar 5786"},shabbat_early:{issur:!0,motzei:!1,preShabbat:!1,holiday:"",progress:5,statusText:"שבת שלום",statusSubtitle:"Vayakhel-Pekudei",countdown:"24h 15m",countdownLabel:"Until Havdalah",targetTimeLocal:"Saturday 8:20 PM",candleLighting:"7:24 PM",havdalah:"8:20 PM",hebrewDate:"19 Adar 5786"},shabbat_mid:{issur:!0,motzei:!1,preShabbat:!1,holiday:"",progress:52,statusText:"שבת שלום",statusSubtitle:"Vayakhel-Pekudei",countdown:"11h 45m",countdownLabel:"Until Havdalah",targetTimeLocal:"Saturday 8:20 PM",candleLighting:"7:24 PM",havdalah:"8:20 PM",hebrewDate:"20 Adar 5786"},shabbat_late:{issur:!0,motzei:!1,preShabbat:!1,holiday:"",progress:92,statusText:"שבת שלום",statusSubtitle:"Vayakhel-Pekudei",countdown:"1h 58m",countdownLabel:"Until Havdalah",targetTimeLocal:"Saturday 8:20 PM",candleLighting:"7:24 PM",havdalah:"8:20 PM",hebrewDate:"20 Adar 5786"},motzei:{issur:!1,motzei:!0,preShabbat:!1,holiday:"",progress:0,statusText:"שבוע טוב",statusSubtitle:"Vayakhel-Pekudei",countdown:"5d 21h",countdownLabel:"Until Candle Lighting",targetTimeLocal:"Friday 7:20 PM",candleLighting:"7:20 PM",havdalah:"8:16 PM",hebrewDate:"20 Adar 5786"},yom_tov:{issur:!0,motzei:!1,preShabbat:!1,holiday:"Pesach",progress:35,statusText:"חג שמח",statusSubtitle:"Pesach",countdown:"16h 30m",countdownLabel:"Until Havdalah",targetTimeLocal:"Monday 8:10 PM",candleLighting:"7:15 PM",havdalah:"8:10 PM",hebrewDate:"15 Nisan 5786"}};function mt(t,e){return t?.states?.[e]?.state||""}function $t(t){if(!t)return"";const e=new Date(t);return isNaN(e.getTime())?"":e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function bt(t){if(t<=0)return"0m";const e=Math.floor(t/6e4),i=Math.floor(e/1440),s=Math.floor(e%1440/60),o=e%60;return i>0?`${i}d ${s}h`:s>0?`${s}h ${o}m`:`${o}m`}function vt(t){if(!t)return"";const e=new Date(t);if(isNaN(e.getTime()))return"";return`${e.toLocaleDateString([],{weekday:"long"})} ${e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`}function wt(t,e,i,s,o){return!1===o?V:e?B`<div class="sc-melt-candle">${function(t,e){const i=gt[t]||gt.large,s=i.svgW/2,o=Math.max(6,.1*i.bodyMaxH),a=Math.max(o,Math.round(i.bodyMaxH*(1-e/100))),n=i.svgH-a-i.pad,r=n+a,l=n-i.flameH+4,c=n+2,h=c-i.wickH,d=i.poolRxBase,p=3+Math.round(e/100*i.poolGrow),g=r+p-2,u=[];"tiny"!==t&&(e>15&&u.push({side:-1,dy:.18,h:.15}),e>30&&u.push({side:1,dy:.1,h:.2}),e>50&&u.push({side:-1,dy:.4,h:.25}),e>65&&u.push({side:1,dy:.55,h:.18}),e>80&&u.push({side:-1,dy:.7,h:.2}),e>90&&u.push({side:1,dy:.3,h:.3}));const f="tiny"===t?.7:"compact"===t?.9:1.2,m="tiny"===t?.8:"compact"===t?1:1.5,$="tiny"===t?1.5:"compact"===t?2:3;return j`
    <svg width="${i.svgW}" height="${i.svgH}" viewBox="0 0 ${i.svgW} ${i.svgH}">
      <defs>
        <linearGradient id="scWaxGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#F5E6C8"/>
          <stop offset="30%" stop-color="#FFF8E7"/>
          <stop offset="70%" stop-color="#FFF3D6"/>
          <stop offset="100%" stop-color="#ECD9A0"/>
        </linearGradient>
        <radialGradient id="scFlameGlow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stop-color="#FFD700" stop-opacity="0.4"/>
          <stop offset="60%" stop-color="#FF8C00" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#FF8C00" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="scFlameBody" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#FFF8E1"/>
          <stop offset="25%" stop-color="#FFE082"/>
          <stop offset="55%" stop-color="#FFB300"/>
          <stop offset="85%" stop-color="#FF6F00"/>
          <stop offset="100%" stop-color="#E65100"/>
        </linearGradient>
        <linearGradient id="scFlameCore" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="30%" stop-color="#E3F2FD"/>
          <stop offset="70%" stop-color="#42A5F5"/>
          <stop offset="100%" stop-color="#1565C0"/>
        </linearGradient>
        <radialGradient id="scPoolGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#FFF8E7"/>
          <stop offset="50%" stop-color="#FFE082"/>
          <stop offset="100%" stop-color="#E6C35C"/>
        </radialGradient>
        <radialGradient id="scAmbient" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#FFD54F" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#FFD54F" stop-opacity="0"/>
        </radialGradient>
        <filter id="scSoftGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="${$}"/>
        </filter>
      </defs>

      <ellipse class="sc-ambient" cx="${s}" cy="${n-10}" rx="${.45*i.svgW}" ry="${.3*i.svgH}" fill="url(#scAmbient)"/>

      <rect x="${s-i.bodyW/2}" y="${n}" width="${i.bodyW}" height="${a}"
        rx="${i.bodyW/2}" ry="3" fill="url(#scWaxGrad)" stroke="#D4B968" stroke-width="0.5"/>
      <rect x="${s-i.bodyW/2+1.5}" y="${n+2}" width="${i.hlW}" height="${Math.max(0,a-6)}"
        rx="1" fill="rgba(255,255,255,0.25)"/>

      ${u.map(t=>{const e=t.side*(i.bodyW/2),o=s+e,r=n+a*t.dy,l=a*t.h;return j`<path d="M${o},${r} q${1*t.side},${.4*l} ${t.side*i.bulge},${.7*l} q${.5*-t.side},${.3*l} ${-t.side*i.bulge},${.3*l}" fill="url(#scWaxGrad)" opacity="0.85"/>`})}

      <ellipse cx="${s}" cy="${g}" rx="${d}" ry="${p}" fill="url(#scPoolGrad)" opacity="0.9"/>
      <ellipse cx="${s-1}" cy="${g-1}" rx="${.5*d}" ry="${.4*p}" fill="rgba(255,255,255,0.2)"/>

      <path d="M${s},${c} Q${s+.8},${h+.4*i.wickH} ${s-.4},${h}"
        stroke="#3E2723" stroke-width="${f}" fill="none" stroke-linecap="round"/>
      <circle cx="${s-.4}" cy="${h}" r="${m}" fill="#FF6F00" opacity="0.8"/>

      <ellipse class="sc-fl-glow" cx="${s}" cy="${l+.55*i.flameH}"
        rx="${1.8*i.flameW}" ry="${.8*i.flameH}" fill="url(#scFlameGlow)" filter="url(#scSoftGlow)"/>

      <path class="sc-fl-body" d="M${s},${l}
        C${s+i.flameW},${l+.35*i.flameH}
         ${s+.7*i.flameW},${l+.85*i.flameH}
         ${s},${l+i.flameH}
        C${s-.7*i.flameW},${l+.85*i.flameH}
         ${s-i.flameW},${l+.35*i.flameH}
         ${s},${l}Z"
        fill="url(#scFlameBody)" opacity="0.95"/>

      <path class="sc-fl-core" d="M${s},${l+.3*i.flameH}
        C${s+.35*i.flameW},${l+.5*i.flameH}
         ${s+.3*i.flameW},${l+.8*i.flameH}
         ${s},${l+.9*i.flameH}
        C${s-.3*i.flameW},${l+.8*i.flameH}
         ${s-.35*i.flameW},${l+.5*i.flameH}
         ${s},${l+.3*i.flameH}Z"
        fill="url(#scFlameCore)" opacity="0.7"/>
    </svg>
  `}(t,s)}</div>`:i?B`<div class="sc-hero sc-float">${a=48,B`<svg width="${a}" height="${a}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L26 18 L40 20 L26 22 L24 36 L22 22 L8 20 L22 18 Z" fill="#FFD700" opacity="0.9"/>
    <path d="M36 6 L37 12 L43 13 L37 14 L36 20 L35 14 L29 13 L35 12 Z" fill="#FFF8E1" opacity="0.7"/>
    <path d="M10 28 L11 33 L16 34 L11 35 L10 40 L9 35 L4 34 L9 33 Z" fill="#FFF8E1" opacity="0.7"/>
  </svg>`}</div>`:B`<div class="sc-hero">${function(t){return B`<svg width="${t}" height="${t}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="14" width="8" height="24" rx="4" fill="url(#ucWax)" stroke="#D4B968" stroke-width="0.5"/>
    <rect x="22" y="16" width="2" height="18" rx="1" fill="rgba(255,255,255,0.25)"/>
    <ellipse cx="24" cy="38" rx="10" ry="3" fill="#E6C35C" opacity="0.6"/>
    <path d="M24,14 Q24.8,10 24,8" stroke="#3E2723" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="24" cy="8" r="1.5" fill="#888" opacity="0.4"/>
    <defs>
      <linearGradient id="ucWax" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#F5E6C8"/>
        <stop offset="50%" stop-color="#FFF8E7"/>
        <stop offset="100%" stop-color="#ECD9A0"/>
      </linearGradient>
    </defs>
  </svg>`}(48)}</div>`;var a}class xt extends lt{static properties={_config:{state:!0}};static styles=a`
    div { padding: 16px; }
    label { display: block; font-weight: 500; margin-bottom: 8px; }
    select {
      width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .spacer { margin-top: 16px; }
    p { margin-top: 8px; font-size: 12px; opacity: 0.5; }
  `;setConfig(t){this._config={...t}}_sizeChanged(t){this._config={...this._config,size:t.target.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}_previewChanged(t){this._config={...this._config,preview:t.target.value},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}render(){const t=this._config?.size||"large",e=this._config?.preview||"off";return B`
      <div>
        <label>Card Size</label>
        <select @change=${this._sizeChanged}>
          <option value="tiny" ?selected=${"tiny"===t}>Tiny \u2014 single-line badge</option>
          <option value="compact" ?selected=${"compact"===t}>Compact \u2014 icon + title + countdown</option>
          <option value="small" ?selected=${"small"===t}>Small \u2014 title + countdown only</option>
          <option value="medium" ?selected=${"medium"===t}>Medium \u2014 adds times, ring & date</option>
          <option value="large" ?selected=${"large"===t}>Large \u2014 full size with all details</option>
        </select>
        <label class="spacer">Preview Mode</label>
        <select @change=${this._previewChanged}>
          <option value="off" ?selected=${"off"===e}>Off \u2014 live data</option>
          <option value="pre_shabbat" ?selected=${"pre_shabbat"===e}>\uD83D\uDD6F\uFE0F Pre-Shabbat \u2014 candles lit (18 min window)</option>
          <option value="shabbat_early" ?selected=${"shabbat_early"===e}>\uD83D\uDD6F\uFE0F Shabbat \u2014 early (sunset)</option>
          <option value="shabbat_mid" ?selected=${"shabbat_mid"===e}>\uD83D\uDD6F\uFE0F Shabbat \u2014 middle (night)</option>
          <option value="shabbat_late" ?selected=${"shabbat_late"===e}>\uD83D\uDD6F\uFE0F Shabbat \u2014 late (dawn)</option>
          <option value="motzei" ?selected=${"motzei"===e}>\u2728 Motzei Shabbat</option>
          <option value="yom_tov" ?selected=${"yom_tov"===e}>\uD83C\uDF1F Yom Tov (Pesach)</option>
        </select>
        <p>Preview renders mock data. Set back to "Off" for live sensors.</p>
      </div>
    `}}customElements.define("shabbat-card-editor",xt);customElements.define("shabbat-card",class extends lt{static styles=ht;static properties={_hass:{state:!0},_config:{state:!0}};_cache={candleLightingTs:null,havdalahTs:null};_lastDataKey=null;setConfig(t){this._config={...ut,...t}}set hass(t){this._hass=t}static getConfigElement(){return document.createElement("shabbat-card-editor")}static getStubConfig(){return{size:"large"}}getCardSize(){return(pt[this._config?.size]||pt.large).cardSize}shouldUpdate(){const t=this._hass?.states?.[dt.candleLighting]?.state,e=t?new Date(t).getTime():NaN,i=Date.now(),s=!isNaN(e)&&i>=e&&i<e+12e5?Math.floor(i/6e4):"",o=(this._config?.size||"")+"|"+(this._config?.preview||"")+"|"+(a=this._hass,Object.values(dt).map(t=>{const e=a?.states?.[t];return(e?.state||"")+JSON.stringify(e?.attributes||{})}).join("|")+"|")+s;var a;return o!==this._lastDataKey&&(this._lastDataKey=o,!0)}_renderRing(t,e){const i=(t.ringSize-2*t.ringStroke)/2,s=2*Math.PI*i,o=s*(1-e/100);return B`
      <div class="sc-ring-wrap">
        <div class="sc-ring">
          <svg viewBox="0 0 ${t.ringSize} ${t.ringSize}">
            <defs>
              <linearGradient id="scGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#F5C563"/>
                <stop offset="100%" style="stop-color:#E8A838"/>
              </linearGradient>
            </defs>
            <circle class="sc-ring-bg" cx="${t.ringSize/2}" cy="${t.ringSize/2}" r="${i}"/>
            <circle class="sc-ring-fg" cx="${t.ringSize/2}" cy="${t.ringSize/2}" r="${i}"
              stroke-dasharray="${s}" stroke-dashoffset="${o}"/>
          </svg>
          <div class="sc-ring-text">
            <div class="sc-ring-pct">${Math.round(e)}%</div>
            <div class="sc-ring-lbl">complete</div>
          </div>
        </div>
      </div>`}render(){if(!this._hass||!this._config)return V;const t=pt[this._config.size]||pt.large,e=function(t,e,i){const s=e?.preview||"off";if("off"!==s&&ft[s])return{...ft[s],error:null};const o=mt(t,dt.issurMelacha);if(!o||"unavailable"===o)return{error:"Jewish Calendar integration not found. Install it from Settings → Integrations."};const a="on"===o,n="on"===mt(t,dt.motzei),r=mt(t,dt.holiday),l=r&&"unknown"!==r&&"unavailable"!==r,c=mt(t,dt.parsha),h=mt(t,dt.hebrewDate),d=mt(t,dt.candleLighting),p=mt(t,dt.havdalah),g=new Date(d).getTime(),u=new Date(p).getTime(),f=Date.now(),m=!a&&!n&&!isNaN(g)&&f>=g,$=m?g+108e4:null;let b,v;if(a&&l?(b="חג שמח",v=r):a?(b="שבת שלום",v=c||""):n?(b="שבוע טוב",v=l?r:c||""):(b="שבת שלום",v=c||""),a){if(!i.candleLightingTs){if(g>f){const t=l?936e5:9e7;i.candleLightingTs=u-t}else i.candleLightingTs=g;i.havdalahTs=u}}else i.candleLightingTs=null,i.havdalahTs=null;let w,x,y,_=0;if(a&&i.candleLightingTs&&i.havdalahTs){const t=i.havdalahTs-i.candleLightingTs;t>0&&(_=Math.max(0,Math.min(100,(f-i.candleLightingTs)/t*100)))}if(m&&$){const t=$-f;w=t>0?bt(t):"",x="Until Shabbat",y=vt(new Date($).toISOString())}else if(a&&i.havdalahTs){const t=i.havdalahTs-f;w=t>0?bt(t):"0m",x="Until Havdalah",y=vt(p)}else{const t=g-f;w=t>0?bt(t):"",x="Until Candle Lighting",y=vt(d)}return{issur:a,motzei:n,preShabbat:m,holiday:l?r:"",progress:_,statusText:b,statusSubtitle:v,countdown:w,countdownLabel:x,targetTimeLocal:y,candleLighting:$t(d),havdalah:$t(p),hebrewDate:h,error:null}}(this._hass,this._config,this._cache);if(e.error)return B`
        <ha-card>
          <div class="sc-error">
            <div class="sc-error-title">Shabbat Card</div>
            <div>${e.error}</div>
          </div>
        </ha-card>`;const i=this._config.preview||"off",s=this._hass.states?.[dt.sun],o=s?.attributes?.elevation,{background:a,isNightSky:n}=function(t,e,i,s,o){let a,n=!1;if(e&&"off"===o&&void 0!==t){const e=parseFloat(t);if(e<-18)a="linear-gradient(180deg, #0a0a2e 0%, #0d1137 35%, #1a1a4e 70%, #1e2761 100%)",n=!0;else if(e<-6){const t=(e+18)/12,i=Math.round(10+16*t),s=Math.round(10+5*t),o=Math.round(46+5*t),r=Math.round(30+170*t),l=Math.round(39+50*t),c=Math.round(97-70*t);a=`linear-gradient(180deg, rgb(${i},${s},${o}) 0%, #1a1a4e 40%, rgb(${Math.round(45+100*t)},${Math.round(25+50*t)},${Math.round(105-40*t)}) 70%, rgb(${r},${l},${c}) 100%)`,n=!0}else if(e<0){const t=(e+6)/6;a=`linear-gradient(180deg, rgb(${Math.round(26+80*t)},${Math.round(15+30*t)},${Math.round(51+20*t)}) 0%, rgb(${Math.round(74+100*t)},${Math.round(25+60*t)},${Math.round(66-20*t)}) 30%, rgb(${Math.round(200+45*t)},${Math.round(90+60*t)},${Math.round(23+30*t)}) 60%, rgb(${Math.round(245)},${Math.round(197+20*t)},${Math.round(99+30*t)}) 100%)`,n=t<.5}else if(e<15){const t=e/15;a=`linear-gradient(180deg, rgb(${Math.round(30+10*t)},${Math.round(60+22*t)},${Math.round(114+30*t)}) 0%, rgb(${Math.round(42+20*t)},${Math.round(82+30*t)},${Math.round(152+20*t)}) 40%, rgb(${Math.round(74+30*t)},${Math.round(139+20*t)},${Math.round(194+10*t)}) 70%, rgb(${Math.round(135+20*t)},${Math.round(206+10*t)},${Math.round(235)}) 100%)`,n=!1}else a="linear-gradient(180deg, #1e3c72 0%, #2a5298 40%, #4a8bc2 70%, #87CEEB 100%)",n=!1}else e?s<10?(a="linear-gradient(180deg, #1a0533 0%, #4a1942 30%, #c85a17 60%, #f5c563 100%)",n=!0):s>85?(a="linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 40%, #2d1b69 70%, #e8a040 100%)",n=!0):(a="linear-gradient(180deg, #0a0a2e 0%, #0d1137 35%, #1a1a4e 70%, #1e2761 100%)",n=!0):i?(a="linear-gradient(180deg, #0d1137 0%, #1a1a4e 40%, #2d2b69 70%, #4a3f8a 100%)",n=!0):a="linear-gradient(180deg, #1e3c72 0%, #2a5298 40%, #4a8bc2 70%, #87CEEB 100%)";return{background:a,isNightSky:n}}(o,e.issur,e.motzei,e.progress,i),r=e.issur&&n||e.motzei?"#F5F0E8":"#FFFFFF",l=t.showStars&&(e.issur&&n||e.motzei),c=e.motzei||e.issur&&void 0!==o&&parseFloat(o)<-12,h=e.holiday?` · ${e.holiday}`:"",d=`\n      --sc-padding: ${t.padding};\n      --sc-min-height: ${t.minHeight};\n      --sc-direction: ${t.horizontal?"row":"column"};\n      --sc-gap: ${t.horizontal?"12px":"0"};\n      --sc-text-color: ${r};\n      --sc-bg: ${a};\n      --sc-title-size: ${t.titleSize};\n      --sc-subtitle-size: ${t.subtitleSize};\n      --sc-countdown-size: ${t.countdownSize};\n      --sc-cd-label-size: ${t.cdLabelSize};\n      --sc-hero-size: ${t.heroSize};\n      --sc-hero-margin: ${t.heroMargin};\n      --sc-ring-size: ${t.ringSize}px;\n      --sc-ring-stroke: ${t.ringStroke};\n      --sc-ring-pct-size: ${t.ringPctSize};\n      --sc-ring-lbl-size: ${t.ringLblSize};\n      --sc-ring-margin: ${t.ringMargin};\n      --sc-times-gap: ${t.timesGap};\n      --sc-times-margin: ${t.timesMargin};\n      --sc-times-size: ${t.timesSize};\n      --sc-date-size: ${t.dateSize};\n      --sc-two-col-gap: ${t.twoColGap||"14px"};\n    `,p=wt(this._config.size,e.issur,e.motzei,e.progress,t.showIcon),g=e.issur&&t.showRing?this._renderRing(t,e.progress):V,u=t.showTimes?B`
      <div class="sc-times">
        <div>
          <div class="sc-time-label">Candle Lighting</div>
          <div class="sc-time-val">${e.candleLighting}</div>
        </div>
        <div>
          <div class="sc-time-label">Havdalah</div>
          <div class="sc-time-val">${e.havdalah}</div>
        </div>
      </div>`:V,f=t.showDate?B`<div class="sc-date">${e.hebrewDate}${h}</div>`:V,m=t.twoCol&&(e.issur||e.motzei);return B`
      <ha-card style="overflow:hidden; border-radius:16px;">
        <div class="sc-widget" style="${d}">
          <div class="sc-bg"></div>
          ${function(t,e){return t?B`<div class="sc-stars">
    ${["✦","✧","✦","✧","✦","✧","✦","✧","✦"].slice(0,e?9:3).map(t=>B`<span class="sc-star">${t}</span>`)}
  </div>`:V}(l,c)}
          ${m?B`
          <div class="sc-content sc-two-col">
            <div class="sc-col-left">
              ${p}
              ${g}
            </div>
            <div class="sc-col-right">
              <div class="sc-title">${e.statusText}</div>
              ${!1!==t.showSubtitle?B`<div class="sc-subtitle">${e.statusSubtitle}</div>`:V}
              <div class="sc-countdown">${e.countdown}</div>
              ${!1!==t.showCdLabel?B`<div class="sc-cd-label">${e.countdownLabel} \u00B7 ${e.targetTimeLocal}</div>`:V}
              ${u}
              ${f}
            </div>
          </div>`:B`
          <div class="sc-content${t.horizontal?" sc-horizontal":""}">
            ${p}
            <div class="sc-title">${e.statusText}</div>
            ${!1!==t.showSubtitle?B`<div class="sc-subtitle">${e.statusSubtitle}</div>`:V}
            ${g}
            <div class="sc-countdown">${e.countdown}</div>
            ${!1!==t.showCdLabel?B`<div class="sc-cd-label">${e.countdownLabel} \u00B7 ${e.targetTimeLocal}</div>`:V}
            ${u}
            ${f}
          </div>`}
        </div>
      </ha-card>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"shabbat-card",name:"Shabbat Card",description:"Animated Shabbat/Yom Tov status card with sun-driven sky, melting candle, and progress tracking"});
