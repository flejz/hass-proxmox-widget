/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,m=globalThis,u=m.trustedTypes,_=u?u.emptyScript:"",v=m.reactiveElementPolyfillSupport,g=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),x={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:f).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[g("elementProperties")]=new Map,b[g("finalized")]=new Map,v?.({ReactiveElement:b}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y=globalThis,w=t=>t,A=y.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,P=`<${C}>`,M=document,N=()=>M.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,z="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,T=/>/g,V=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,F=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),L=Symbol.for("lit-noChange"),I=Symbol.for("lit-nothing"),W=new WeakMap,q=M.createTreeWalker(M,129);function K(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===H?"!--"===l[1]?n=R:void 0!==l[1]?n=T:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=V):void 0!==l[3]&&(n=V):n===V?">"===l[0]?(n=o??H,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?V:'"'===l[3]?F:D):n===F||n===D?n=V:n===R||n===T?n=H:(n=V,o=void 0);const h=n===V&&t[e+1].startsWith("/>")?" ":"";r+=n===H?s+P:c>=0?(i.push(a),s.slice(0,c)+k+s.slice(c)+E+h):s+E+(-2===c?e:h)}return[K(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=J.createElement(l,s),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=q.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=c[r++],s=i.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],N()),q.nextNode(),a.push({type:2,index:++o});i.append(t[e],N())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===L)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=U(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);q.currentNode=i;let o=q.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new X(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new it(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=q.nextNode(),r++)}return q.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===I||null==t||""===t?(this._$AH!==I&&this._$AR(),this._$AH=I):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==I&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new X(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=I,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=I}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=G(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==L,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=G(this,i[s+n],e,n),a===L&&(a=this._$AH[n]),r||=!U(a)||a!==this._$AH[n],a===I?t=I:t!==I&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===I?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==I)}}class st extends Y{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??I)===L)return;const s=this._$AH,i=t===I&&s!==I||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==I&&(s===I||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=y.litHtmlPolyfillSupport;ot?.(J,X),(y.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new X(e.insertBefore(N(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const at=rt.litElementPolyfillSupport;at?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");const lt={node_cpu:"cpu",node_memory_percentage:"memory_pct",node_memory:"memory_gb",node_disk:"disk_gb",node_max_disk:"disk_max_gb",node_uptime:"uptime_h"},ct={container_cpu:"cpu",container_memory_percentage:"memory_pct",container_memory:"memory_gb",container_disk:"disk_gb",container_max_disk:"disk_max_gb",container_uptime:"uptime_h",container_netin:"net_in_mbs",container_netout:"net_out_mbs",status:"running"},dt={storage_used:"used_gb",storage_total:"total_gb",storage_used_percentage:"used_pct"},ht={Node:"node",Container:"lxc",QEMU:"vm",Storage:"storage"};function pt(t){return"node"===t?lt:"storage"===t?dt:ct}function mt(t,e){if(!t?.entities)return{nodes:[],vms:[],storages:[]};const s=new Set(e?.exclude??[]),i=new Map;for(const[e,o]of Object.entries(t.entities))"proxmoxve"===o.platform&&(s.has(e)||o.device_id&&(i.has(o.device_id)||i.set(o.device_id,[]),i.get(o.device_id).push({entity_id:e,translation_key:o.translation_key})));const o=[],r=[],n=[];for(const[e,s]of i){const i=t.devices?.[e],a=ht[i?.model];if(!a)continue;const l=i?.name_by_user||i?.name||e,c=pt(a),d={};for(const{entity_id:e,translation_key:i}of s){const s=c[i];if(!s||s in d)continue;const o=t.states?.[e]??null;d[s]={entity_id:e,state:o}}const h=i?.via_device_id;if("storage"===a){const t=l.replace(/^Storage \(/,"").replace(/\)$/,"");n.push({type:"storage",name:t,device_id:e,node_device_id:h,entities:d})}else"node"===a?o.push({type:a,name:l,device_id:e,node_device_id:h,entities:d}):r.push({type:a,name:l,device_id:e,node_device_id:h,entities:d})}return o.sort((t,e)=>t.name.localeCompare(e.name)),r.sort((t,e)=>t.name.localeCompare(e.name)),n.sort((t,e)=>t.name.localeCompare(e.name)),{nodes:o,vms:r,storages:n}}function ut(t){return null==t?"—":parseFloat(t).toFixed(1)+"%"}function _t(t){if(null==t)return"—";const e=parseFloat(t);return isNaN(e)?"—":e>=1?e.toFixed(1)+" GiB":(1024*e).toFixed(0)+" MiB"}function vt(t){if(null==t)return"—";const e=parseFloat(t);return isNaN(e)?"—":e>=1?e.toFixed(1)+" MB/s":e>=.001?(1024*e).toFixed(1)+" KB/s":(1024*e*1024).toFixed(0)+" B/s"}class gt extends nt{static properties={label:{type:String},value:{type:String},percent:{type:Number}};static styles=r`
    :host {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .label {
      color: var(--secondary-text-color);
      font-size: 0.75em;
      font-weight: 500;
      text-transform: uppercase;
      width: 2.6em;
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }
    .track {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.4s ease;
    }
    .fill.success {
      background: var(--success-color, #43a047);
    }
    .fill.warning {
      background: var(--warning-color, #ffa600);
    }
    .fill.error {
      background: var(--error-color, #db4437);
    }
    .value {
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      text-align: right;
      width: 4em;
      flex-shrink: 0;
      font-size: 0.82em;
    }
  `;_colorClass(){const t=this.percent??0;return t>=90?"error":t>=70?"warning":"success"}render(){const t=Math.min(100,Math.max(0,this.percent??0));return B`
      <span class="label">${this.label}</span>
      <div class="track">
        <div class="fill ${this._colorClass()}" style="width:${t}%;${t>0?"min-width:2px":""}"></div>
      </div>
      <span class="value">${this.value}</span>
    `}}customElements.define("proxmox-stat-bar",gt);class ft extends nt{static properties={group:{type:Object},mode:{type:String}};static styles=r`
    :host {
      display: block;
    }
    .header {
      display: flex;
      align-items: baseline;
      gap: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 5px;
    }
    .node-name {
      flex: 1;
      font-weight: 600;
      font-size: 0.9em;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .uptime {
      color: var(--secondary-text-color);
      font-size: 0.75em;
      white-space: nowrap;
      flex-shrink: 0;
    }
    proxmox-stat-bar {
      margin-bottom: 3px;
    }
    proxmox-stat-bar:last-of-type {
      margin-bottom: 0;
    }
    .net-row {
      display: flex;
      gap: 10px;
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 0.75em;
      font-variant-numeric: tabular-nums;
    }
    .net-row span {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  `;_s(t){return this.group?.entities?.[t]?.state?.state??null}render(){const{mode:t,group:e}=this,s=this._s("cpu"),i=this._s("memory_pct"),o=this._s("disk_gb"),r=this._s("disk_max_gb"),n=this._s("uptime_h"),a=parseFloat(s)||0,l=parseFloat(i)||0,c=o&&r?parseFloat(o)/parseFloat(r)*100:0;return B`
      <div class="header">
        <span class="node-name">${e?.name??"—"}</span>
        ${"minimal"!==t?B`<span class="uptime">${function(t){if(null==t)return"—";const e=parseFloat(t);if(isNaN(e))return"—";const s=Math.floor(e/24),i=Math.floor(e%24),o=Math.floor(e%1*60);return s>0?`${s}d ${i}h`:i>0?`${i}h ${o}m`:`${o}m`}(n)}</span>`:""}
      </div>

      <proxmox-stat-bar
        .label=${"CPU"}
        .value=${ut(s)}
        .percent=${a}
      ></proxmox-stat-bar>

      <proxmox-stat-bar
        .label=${"RAM"}
        .value=${ut(i)}
        .percent=${l}
      ></proxmox-stat-bar>

      ${"minimal"!==t?B`
            <proxmox-stat-bar
              .label=${"DSK"}
              .value=${_t(o)}
              .percent=${c}
            ></proxmox-stat-bar>
          `:""}
    `}}customElements.define("proxmox-node-row",ft);class $t extends nt{static properties={hass:{attribute:!1},_config:{state:!0}};static styles=r`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 16px;
    }
    .section-title {
      font-size: 0.78em;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    ha-textfield,
    ha-select {
      width: 100%;
    }
    /* Mode pills */
    .mode-row { display: flex; gap: 8px; }
    .mode-btn {
      flex: 1;
      padding: 8px 0;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9em;
      color: var(--secondary-text-color);
      transition: all 0.15s;
    }
    .mode-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 500;
    }
    /* Column toggles */
    .col-row { display: flex; gap: 6px; }
    .col-btn {
      padding: 5px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.82em;
      color: var(--secondary-text-color);
      transition: all 0.15s;
    }
    .col-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    /* Check lists */
    .check-list {
      display: flex;
      flex-direction: column;
    }
    ha-formfield {
      display: block;
    }
    /* Section toggles */
    .toggles { display: flex; flex-direction: column; gap: 4px; }
    .sub-label {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .no-entities {
      font-size: 0.82em;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;setConfig(t){this._config={title:"Proxmox",mode:"normal",show_network:!0,show_storage:!0,show_vm_cpu:!0,show_vm_mem:!0,show_vm_disk:!0,sort_vms:"name",nodes:null,vms:null,...t}}_fire(t,e){this._config&&(this._config={...this._config,[t]:e},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})))}_isNodeSelected(t,e){const s=this._config.nodes;return null===s||(s??[]).includes(t)}_isVmSelected(t){const e=this._config.vms;return null===e||(e??[]).includes(t)}_toggleNode(t,e,s){const i=null===this._config.nodes?[...s]:[...this._config.nodes??[]],o=e?[...new Set([...i,t])]:i.filter(e=>e!==t);this._fire("nodes",o.length===s.length?null:o)}_toggleVm(t,e,s){const i=null===this._config.vms?[...s]:[...this._config.vms??[]],o=e?[...new Set([...i,t])]:i.filter(e=>e!==t);this._fire("vms",o.length===s.length?null:o)}_toggleCol(t){this._fire(t,!1===this._config[t])}render(){if(!this._config)return B``;const t=this.hass?mt(this.hass,{}):{nodes:[],vms:[]},{nodes:e,vms:s}=t,i=e.map(t=>t.device_id),o=s.map(t=>t.device_id),r=this._config;return B`
      <div class="editor">

        <!-- ── Display ── -->
        <div class="section-title">Display</div>

        <ha-textfield
          label="Card title"
          .value=${r.title??"Proxmox"}
          @change=${t=>this._fire("title",t.target.value)}
        ></ha-textfield>

        <div>
          <div class="sub-label">Mode</div>
          <div class="mode-row">
            <button class="mode-btn ${"dense"!==r.mode?"active":""}"
              @click=${()=>this._fire("mode","normal")}>Normal</button>
            <button class="mode-btn ${"dense"===r.mode?"active":""}"
              @click=${()=>this._fire("mode","dense")}>Dense</button>
          </div>
        </div>

        <!-- ── Nodes ── -->
        <div class="section-title">Nodes</div>
        ${0===e.length?B`<div class="no-entities">No Proxmox nodes found. Configure the integration first.</div>`:B`
            <div class="check-list">
              ${e.map(t=>B`
                <ha-formfield .label=${t.name}>
                  <ha-checkbox
                    .checked=${this._isNodeSelected(t.device_id,i)}
                    @change=${e=>this._toggleNode(t.device_id,e.target.checked,i)}
                  ></ha-checkbox>
                </ha-formfield>
              `)}
            </div>
          `}

        <!-- ── VMs & Containers ── -->
        <div class="section-title">VMs &amp; Containers</div>

        <ha-select
          label="Sort by"
          .value=${r.sort_vms??"name"}
          @value-changed=${t=>this._fire("sort_vms",t.detail.value)}
          fixedMenuPosition
        >
          <mwc-list-item value="name">Name (A → Z)</mwc-list-item>
          <mwc-list-item value="cpu">CPU usage (high → low)</mwc-list-item>
          <mwc-list-item value="ram">RAM usage (high → low)</mwc-list-item>
          <mwc-list-item value="disk">Disk usage (high → low)</mwc-list-item>
        </ha-select>

        <div>
          <div class="sub-label">Show columns</div>
          <div class="col-row">
            ${[["show_vm_cpu","CPU"],["show_vm_mem","MEM"],["show_vm_disk","DSK"]].map(([t,e])=>B`
              <button class="col-btn ${!1!==r[t]?"active":""}"
                @click=${()=>this._toggleCol(t)}>${e}</button>
            `)}
          </div>
        </div>

        ${0===s.length?B`<div class="no-entities">No VMs or containers found.</div>`:B`
            <div class="check-list">
              ${s.map(t=>B`
                <ha-formfield .label=${`${t.name} (${"vm"===t.type?"VM":"CT"})`}>
                  <ha-checkbox
                    .checked=${this._isVmSelected(t.device_id)}
                    @change=${e=>this._toggleVm(t.device_id,e.target.checked,o)}
                  ></ha-checkbox>
                </ha-formfield>
              `)}
            </div>
          `}

        <!-- ── Sections ── -->
        <div class="section-title">Sections</div>
        <div class="toggles">
          <ha-formfield label="Show Network section">
            <ha-switch
              .checked=${!1!==r.show_network}
              @change=${t=>this._fire("show_network",t.target.checked)}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show Storage section">
            <ha-switch
              .checked=${!1!==r.show_storage}
              @change=${t=>this._fire("show_storage",t.target.checked)}
            ></ha-switch>
          </ha-formfield>
        </div>

      </div>
    `}}customElements.define("proxmox-card-editor",$t);const xt=["normal","dense"];class bt extends nt{static properties={hass:{attribute:!1},_config:{state:!0},_mode:{state:!0}};static styles=r`
    :host { display: block; }
    .card-content { padding: 16px; }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .title { font-size: 1em; font-weight: 600; color: var(--primary-text-color); }
    .mode-switcher { display: flex; gap: 3px; }
    .mode-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 0.68em;
      font-family: inherit;
      letter-spacing: 0.02em;
      padding: 2px 7px;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .mode-btn[aria-pressed='true'] {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    /* ── Layout ── */
    .node-block { margin-bottom: 12px; }
    .node-block:last-child { margin-bottom: 0; }
    .node-divider { border: none; border-top: 1px solid var(--divider-color); margin: 10px 0; }
    .section-label {
      color: var(--secondary-text-color);
      font-size: 0.7em;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .empty { color: var(--secondary-text-color); font-size: 0.88em; padding: 12px 0; text-align: center; }

    /* ── VM rows (inline rendering for pixel-perfect column alignment) ── */
    .vm-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
    }
    .vm-row.dense { padding: 2px 0; border-bottom: 1px solid var(--divider-color, transparent); }
    .vr-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .vr-dot.on  { background: var(--success-color,  #43a047); }
    .vr-dot.off { background: var(--disabled-color, #9e9e9e); }
    .vr-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-size: 0.88em;
    }
    /* Fixed px width so header labels align perfectly with data columns */
    .vr-badge {
      width: 28px;
      text-align: center;
      font-size: 0.72em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      background: var(--divider-color);
      border-radius: 3px;
      padding: 2px 0;
      flex-shrink: 0;
    }
    .vr-stats { display: flex; gap: 2px; flex-shrink: 0; }
    .vr-stat {
      width: 42px;
      text-align: right;
      font-size: 0.82em;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .vr-stat-wide {
      width: 56px;
      text-align: right;
      font-size: 0.82em;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }

    /* Column header row — same flex structure, invisible placeholders */
    .vm-col-header { padding-top: 2px; padding-bottom: 3px; }
    .vm-col-header .vr-dot   { visibility: hidden; }
    .vm-col-header .vr-name  { visibility: hidden; }
    .vm-col-header .vr-badge { visibility: hidden; }
    .vm-col-header .vr-stat,
    .vm-col-header .vr-stat-wide {
      font-size: 0.68em;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
    }

    /* ── Network section ── */
    .net-section { margin-top: 4px; }
    .net-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 0;
      font-size: 0.82em;
    }
    .net-name {
      flex: 1;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Fixed px so header UP/DOWN aligns with data values */
    .net-val {
      width: 74px;
      text-align: right;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      font-size: 0.88em;
    }
    .net-header { padding-bottom: 2px; }
    .net-header .net-name { visibility: hidden; }
    .net-header .net-val {
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ── Storage section ── */
    .storage-section { margin-top: 4px; }
    .storage-item { margin-bottom: 4px; }
    .storage-name { font-size: 0.8em; color: var(--primary-text-color); margin-bottom: 1px; }
  `;static getStubConfig(){return{title:"Proxmox",mode:"normal"}}static getConfigElement(){return document.createElement("proxmox-card-editor")}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={title:"Proxmox",mode:"normal",exclude:[],show_network:!0,show_storage:!0,show_vm_cpu:!0,show_vm_mem:!0,show_vm_disk:!0,sort_vms:"name",nodes:null,vms:null,...t},xt.includes(this._config.mode)||(this._config.mode="normal"),this._mode=null}get _activeMode(){return this._mode??this._config?.mode??"normal"}_switchMode(t){this._mode=t}_sortVms(t){const e=this._config?.sort_vms??"name";return"name"===e?t:[...t].sort((t,s)=>{const i=(t,e)=>parseFloat(t.entities?.[e]?.state?.state)||0,o={cpu:"cpu",ram:"memory_pct",disk:"disk_gb"};return i(s,o[e]??"cpu")-i(t,o[e]??"cpu")})}render(){if(!this.hass||!this._config)return B``;const{nodes:t,vms:e,storages:s}=mt(this.hass,this._config),i=this._config.nodes,o=this._config.vms,r=null===i?t:t.filter(t=>i.includes(t.device_id)),n=this._sortVms(null===o?e:e.filter(t=>o.includes(t.device_id))),a=this._activeMode;return B`
      <ha-card>
        <div class="card-content">
          ${this._renderHeader(a)}
          ${0===r.length&&0===n.length?B`<div class="empty">No Proxmox entities found.<br>Configure the Proxmox VE integration in Home Assistant.</div>`:this._renderNodes(r,n,s,a)}
        </div>
      </ha-card>
    `}_renderHeader(t){return B`
      <div class="header">
        <span class="title">${this._config.title}</span>
        <div class="mode-switcher" role="group" aria-label="Display mode">
          ${xt.map(e=>B`
            <button class="mode-btn" aria-pressed=${t===e?"true":"false"}
              @click=${()=>this._switchMode(e)}>${e}</button>
          `)}
        </div>
      </div>
    `}_renderNodes(t,e,s,i){const o=e.filter(e=>!t.find(t=>t.device_id===e.node_device_id));return 0===t.length?B`
        ${this._renderVmSection(e,i)}
        ${!1!==this._config.show_network?this._renderNetworkSection(e,i):""}
        ${!1!==this._config.show_storage?this._renderStorageSection(s,i):""}
      `:B`
      ${t.map((t,o)=>{const r=e.filter(e=>e.node_device_id===t.device_id),n=s.filter(e=>e.node_device_id===t.device_id);return B`
          ${o>0?B`<hr class="node-divider">`:""}
          <div class="node-block">
            <proxmox-node-row .group=${t} .mode=${i}></proxmox-node-row>
            ${r.length>0?B`
              ${this._renderVmSection(r,i)}
              ${!1!==this._config.show_network?this._renderNetworkSection(r,i):""}
            `:""}
            ${n.length>0&&!1!==this._config.show_storage?this._renderStorageSection(n,i):""}
          </div>
        `})}
      ${o.length>0?B`
        <hr class="node-divider">
        ${this._renderVmSection(o,i)}
        ${!1!==this._config.show_network?this._renderNetworkSection(o,i):""}
      `:""}
      ${(()=>{const e=s.filter(e=>!t.find(t=>t.device_id===e.node_device_id));return e.length>0&&!1!==this._config.show_storage?this._renderStorageSection(e,i):""})()}
    `}_renderVmRow(t,e){const s="dense"===e,i=e=>t.entities?.[e]?.state?.state??null,o="on"===i("running"),r=!1!==this._config.show_vm_cpu,n=!1!==this._config.show_vm_mem,a=!1!==this._config.show_vm_disk,l=r||n||a;return B`
      <div class="vm-row ${s?"dense":""}">
        <div class="vr-dot ${o?"on":"off"}"></div>
        <span class="vr-name">${t.name}</span>
        <span class="vr-badge">${"vm"===t.type?"VM":"CT"}</span>
        ${l?B`
          <div class="vr-stats">
            ${r?B`<span class="vr-stat">${ut(i("cpu"))}</span>`:""}
            ${n?B`<span class="vr-stat">${ut(i("memory_pct"))}</span>`:""}
            ${a?B`<span class="vr-stat-wide">${_t(i("disk_gb"))}</span>`:""}
          </div>
        `:""}
      </div>
    `}_renderVmSection(t,e){if(!t.length)return B``;const s=!1!==this._config.show_vm_cpu,i=!1!==this._config.show_vm_mem,o=!1!==this._config.show_vm_disk;return B`
      <div class="section-label" style="margin: 8px 0 2px">VMs &amp; Containers</div>
      ${s||i||o?B`
        <div class="vm-row vm-col-header">
          <div class="vr-dot"></div>
          <span class="vr-name"></span>
          <span class="vr-badge"></span>
          <div class="vr-stats">
            ${s?B`<span class="vr-stat">CPU</span>`:""}
            ${i?B`<span class="vr-stat">MEM</span>`:""}
            ${o?B`<span class="vr-stat-wide">DSK</span>`:""}
          </div>
        </div>
      `:""}
      <div>${t.map(t=>this._renderVmRow(t,e))}</div>
    `}_renderNetworkSection(t,e){const s=t.filter(t=>t.entities.net_in_mbs||t.entities.net_out_mbs);return s.length?B`
      <div class="section-label" style="margin-top:10px">Network</div>
      <div class="net-section">
        <div class="net-row net-header">
          <span class="net-name"></span>
          <span class="net-val">UP</span>
          <span class="net-val">DOWN</span>
        </div>
        ${s.map(t=>{const e=t.entities.net_in_mbs?.state?.state,s=t.entities.net_out_mbs?.state?.state;return B`
            <div class="net-row">
              <span class="net-name">${t.name}</span>
              <span class="net-val">${vt(s)}</span>
              <span class="net-val">${vt(e)}</span>
            </div>
          `})}
      </div>
    `:B``}_renderStorageSection(t,e){return t.length?B`
      <div class="section-label" style="margin-top:10px">Storage</div>
      <div class="storage-section">
        ${t.map(t=>{const e=t.entities.used_gb?.state?.state,s=parseFloat(t.entities.used_pct?.state?.state)||0;return B`
            <div class="storage-item">
              <div class="storage-name">${t.name}</div>
              <proxmox-stat-bar .label=${" "} .value=${_t(e)} .percent=${s}></proxmox-stat-bar>
            </div>
          `})}
      </div>
    `:B``}getCardSize(){return 3}}customElements.define("proxmox-card",bt),window.customCards=window.customCards||[],window.customCards.push({type:"proxmox-card",name:"Proxmox Card",description:"Monitor Proxmox VE nodes, VMs, and containers",preview:!1,documentationURL:"https://github.com/flejz/hass-proxmox-widget"});
