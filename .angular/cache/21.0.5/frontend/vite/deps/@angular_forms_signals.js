import {
  AbstractControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from "./chunk-DZSTUURT.js";
import {
  httpResource
} from "./chunk-SDHSADMU.js";
import "./chunk-TWR4SI2J.js";
import "./chunk-UUDDPAME.js";
import {
  APP_ID,
  Directive,
  ElementRef,
  InjectionToken,
  Injector,
  Input,
  RuntimeError,
  SIGNAL,
  computed,
  effect,
  inject,
  input,
  isPromise,
  linkedSignal,
  resource,
  runInInjectionContext,
  setClassMetadata,
  signal,
  untracked,
  ɵCONTROL,
  ɵcontrolUpdate,
  ɵɵProvidersFeature,
  ɵɵcontrolCreate,
  ɵɵdefineDirective
} from "./chunk-C2XHQSW5.js";
import "./chunk-IUYOXXGF.js";
import "./chunk-E6EFAV6K.js";
import "./chunk-NSR2RS4C.js";
import "./chunk-HSWANC32.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-H2SRQSE4.js";

// node_modules/@angular/forms/fesm2022/_structure-chunk.mjs
var boundPathDepth = 0;
function getBoundPathDepth() {
  return boundPathDepth;
}
function setBoundPathDepthForResolution(fn, depth) {
  return (...args) => {
    try {
      boundPathDepth = depth;
      return fn(...args);
    } finally {
      boundPathDepth = 0;
    }
  };
}
function shortCircuitFalse(value) {
  return !value;
}
function shortCircuitTrue(value) {
  return value;
}
function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return (typeof value === "object" || typeof value === "function") && value != null;
}
var DYNAMIC = Symbol();
var IGNORED = Symbol();
var AbstractLogic = class {
  predicates;
  fns = [];
  constructor(predicates) {
    this.predicates = predicates;
  }
  push(logicFn) {
    this.fns.push(wrapWithPredicates(this.predicates, logicFn));
  }
  mergeIn(other) {
    const fns = this.predicates ? other.fns.map((fn) => wrapWithPredicates(this.predicates, fn)) : other.fns;
    this.fns.push(...fns);
  }
};
var BooleanOrLogic = class extends AbstractLogic {
  get defaultValue() {
    return false;
  }
  compute(arg) {
    return this.fns.some((f) => {
      const result = f(arg);
      return result && result !== IGNORED;
    });
  }
};
var ArrayMergeIgnoreLogic = class _ArrayMergeIgnoreLogic extends AbstractLogic {
  ignore;
  static ignoreNull(predicates) {
    return new _ArrayMergeIgnoreLogic(predicates, (e) => e === null);
  }
  constructor(predicates, ignore) {
    super(predicates);
    this.ignore = ignore;
  }
  get defaultValue() {
    return [];
  }
  compute(arg) {
    return this.fns.reduce((prev, f) => {
      const value = f(arg);
      if (value === void 0 || value === IGNORED) {
        return prev;
      } else if (isArray(value)) {
        return [...prev, ...this.ignore ? value.filter((e) => !this.ignore(e)) : value];
      } else {
        if (this.ignore && this.ignore(value)) {
          return prev;
        }
        return [...prev, value];
      }
    }, []);
  }
};
var ArrayMergeLogic = class extends ArrayMergeIgnoreLogic {
  constructor(predicates) {
    super(predicates, void 0);
  }
};
var MetadataMergeLogic = class extends AbstractLogic {
  key;
  get defaultValue() {
    return this.key.reducer.getInitial();
  }
  constructor(predicates, key) {
    super(predicates);
    this.key = key;
  }
  compute(ctx) {
    if (this.fns.length === 0) {
      return this.key.reducer.getInitial();
    }
    let acc = this.key.reducer.getInitial();
    for (let i = 0; i < this.fns.length; i++) {
      const item = this.fns[i](ctx);
      if (item !== IGNORED) {
        acc = this.key.reducer.reduce(acc, item);
      }
    }
    return acc;
  }
};
function wrapWithPredicates(predicates, logicFn) {
  if (predicates.length === 0) {
    return logicFn;
  }
  return (arg) => {
    for (const predicate of predicates) {
      let predicateField = arg.stateOf(predicate.path);
      const depthDiff = untracked(predicateField.structure.pathKeys).length - predicate.depth;
      for (let i = 0; i < depthDiff; i++) {
        predicateField = predicateField.structure.parent;
      }
      if (!predicate.fn(predicateField.context)) {
        return IGNORED;
      }
    }
    return logicFn(arg);
  };
}
var LogicContainer = class {
  predicates;
  hidden;
  disabledReasons;
  readonly;
  syncErrors;
  syncTreeErrors;
  asyncErrors;
  metadata = /* @__PURE__ */ new Map();
  constructor(predicates) {
    this.predicates = predicates;
    this.hidden = new BooleanOrLogic(predicates);
    this.disabledReasons = new ArrayMergeLogic(predicates);
    this.readonly = new BooleanOrLogic(predicates);
    this.syncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    this.syncTreeErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    this.asyncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
  }
  hasMetadata(key) {
    return this.metadata.has(key);
  }
  getMetadataKeys() {
    return this.metadata.keys();
  }
  getMetadata(key) {
    if (!this.metadata.has(key)) {
      this.metadata.set(key, new MetadataMergeLogic(this.predicates, key));
    }
    return this.metadata.get(key);
  }
  mergeIn(other) {
    this.hidden.mergeIn(other.hidden);
    this.disabledReasons.mergeIn(other.disabledReasons);
    this.readonly.mergeIn(other.readonly);
    this.syncErrors.mergeIn(other.syncErrors);
    this.syncTreeErrors.mergeIn(other.syncTreeErrors);
    this.asyncErrors.mergeIn(other.asyncErrors);
    for (const key of other.getMetadataKeys()) {
      const metadataLogic = other.metadata.get(key);
      this.getMetadata(key).mergeIn(metadataLogic);
    }
  }
};
var AbstractLogicNodeBuilder = class {
  depth;
  constructor(depth) {
    this.depth = depth;
  }
  build() {
    return new LeafLogicNode(this, [], 0);
  }
};
var LogicNodeBuilder = class _LogicNodeBuilder extends AbstractLogicNodeBuilder {
  constructor(depth) {
    super(depth);
  }
  current;
  all = [];
  addHiddenRule(logic) {
    this.getCurrent().addHiddenRule(logic);
  }
  addDisabledReasonRule(logic) {
    this.getCurrent().addDisabledReasonRule(logic);
  }
  addReadonlyRule(logic) {
    this.getCurrent().addReadonlyRule(logic);
  }
  addSyncErrorRule(logic) {
    this.getCurrent().addSyncErrorRule(logic);
  }
  addSyncTreeErrorRule(logic) {
    this.getCurrent().addSyncTreeErrorRule(logic);
  }
  addAsyncErrorRule(logic) {
    this.getCurrent().addAsyncErrorRule(logic);
  }
  addMetadataRule(key, logic) {
    this.getCurrent().addMetadataRule(key, logic);
  }
  getChild(key) {
    if (key === DYNAMIC) {
      const children = this.getCurrent().children;
      if (children.size > (children.has(DYNAMIC) ? 1 : 0)) {
        this.current = void 0;
      }
    }
    return this.getCurrent().getChild(key);
  }
  hasLogic(builder) {
    if (this === builder) {
      return true;
    }
    return this.all.some(({
      builder: subBuilder
    }) => subBuilder.hasLogic(builder));
  }
  mergeIn(other, predicate) {
    if (predicate) {
      this.all.push({
        builder: other,
        predicate: {
          fn: setBoundPathDepthForResolution(predicate.fn, this.depth),
          path: predicate.path
        }
      });
    } else {
      this.all.push({
        builder: other
      });
    }
    this.current = void 0;
  }
  getCurrent() {
    if (this.current === void 0) {
      this.current = new NonMergeableLogicNodeBuilder(this.depth);
      this.all.push({
        builder: this.current
      });
    }
    return this.current;
  }
  static newRoot() {
    return new _LogicNodeBuilder(0);
  }
};
var NonMergeableLogicNodeBuilder = class extends AbstractLogicNodeBuilder {
  logic = new LogicContainer([]);
  children = /* @__PURE__ */ new Map();
  constructor(depth) {
    super(depth);
  }
  addHiddenRule(logic) {
    this.logic.hidden.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addDisabledReasonRule(logic) {
    this.logic.disabledReasons.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addReadonlyRule(logic) {
    this.logic.readonly.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addSyncErrorRule(logic) {
    this.logic.syncErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addSyncTreeErrorRule(logic) {
    this.logic.syncTreeErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addAsyncErrorRule(logic) {
    this.logic.asyncErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addMetadataRule(key, logic) {
    this.logic.getMetadata(key).push(setBoundPathDepthForResolution(logic, this.depth));
  }
  getChild(key) {
    if (!this.children.has(key)) {
      this.children.set(key, new LogicNodeBuilder(this.depth + 1));
    }
    return this.children.get(key);
  }
  hasLogic(builder) {
    return this === builder;
  }
};
var LeafLogicNode = class _LeafLogicNode {
  builder;
  predicates;
  depth;
  logic;
  constructor(builder, predicates, depth) {
    this.builder = builder;
    this.predicates = predicates;
    this.depth = depth;
    this.logic = builder ? createLogic(builder, predicates, depth) : new LogicContainer([]);
  }
  getChild(key) {
    const childBuilders = this.builder ? getAllChildBuilders(this.builder, key) : [];
    if (childBuilders.length === 0) {
      return new _LeafLogicNode(void 0, [], this.depth + 1);
    } else if (childBuilders.length === 1) {
      const {
        builder,
        predicates
      } = childBuilders[0];
      return new _LeafLogicNode(builder, [...this.predicates, ...predicates.map((p) => bindLevel(p, this.depth))], this.depth + 1);
    } else {
      const builtNodes = childBuilders.map(({
        builder,
        predicates
      }) => new _LeafLogicNode(builder, [...this.predicates, ...predicates.map((p) => bindLevel(p, this.depth))], this.depth + 1));
      return new CompositeLogicNode(builtNodes);
    }
  }
  hasLogic(builder) {
    return this.builder?.hasLogic(builder) ?? false;
  }
};
var CompositeLogicNode = class _CompositeLogicNode {
  all;
  logic;
  constructor(all) {
    this.all = all;
    this.logic = new LogicContainer([]);
    for (const node of all) {
      this.logic.mergeIn(node.logic);
    }
  }
  getChild(key) {
    return new _CompositeLogicNode(this.all.flatMap((child) => child.getChild(key)));
  }
  hasLogic(builder) {
    return this.all.some((node) => node.hasLogic(builder));
  }
};
function getAllChildBuilders(builder, key) {
  if (builder instanceof LogicNodeBuilder) {
    return builder.all.flatMap(({
      builder: builder2,
      predicate
    }) => {
      const children = getAllChildBuilders(builder2, key);
      if (predicate) {
        return children.map(({
          builder: builder3,
          predicates
        }) => ({
          builder: builder3,
          predicates: [...predicates, predicate]
        }));
      }
      return children;
    });
  } else if (builder instanceof NonMergeableLogicNodeBuilder) {
    return [...key !== DYNAMIC && builder.children.has(DYNAMIC) ? [{
      builder: builder.getChild(DYNAMIC),
      predicates: []
    }] : [], ...builder.children.has(key) ? [{
      builder: builder.getChild(key),
      predicates: []
    }] : []];
  } else {
    throw new RuntimeError(1909, ngDevMode && "Unknown LogicNodeBuilder type");
  }
}
function createLogic(builder, predicates, depth) {
  const logic = new LogicContainer(predicates);
  if (builder instanceof LogicNodeBuilder) {
    const builtNodes = builder.all.map(({
      builder: builder2,
      predicate
    }) => new LeafLogicNode(builder2, predicate ? [...predicates, bindLevel(predicate, depth)] : predicates, depth));
    for (const node of builtNodes) {
      logic.mergeIn(node.logic);
    }
  } else if (builder instanceof NonMergeableLogicNodeBuilder) {
    logic.mergeIn(builder.logic);
  } else {
    throw new RuntimeError(1909, ngDevMode && "Unknown LogicNodeBuilder type");
  }
  return logic;
}
function bindLevel(predicate, depth) {
  return __spreadProps(__spreadValues({}, predicate), {
    depth
  });
}
var PATH = Symbol("PATH");
var FieldPathNode = class _FieldPathNode {
  keys;
  parent;
  keyInParent;
  root;
  children = /* @__PURE__ */ new Map();
  fieldPathProxy = new Proxy(this, FIELD_PATH_PROXY_HANDLER);
  logicBuilder;
  constructor(keys, root, parent, keyInParent) {
    this.keys = keys;
    this.parent = parent;
    this.keyInParent = keyInParent;
    this.root = root ?? this;
    if (!parent) {
      this.logicBuilder = LogicNodeBuilder.newRoot();
    }
  }
  get builder() {
    if (this.logicBuilder) {
      return this.logicBuilder;
    }
    return this.parent.builder.getChild(this.keyInParent);
  }
  getChild(key) {
    if (!this.children.has(key)) {
      this.children.set(key, new _FieldPathNode([...this.keys, key], this.root, this, key));
    }
    return this.children.get(key);
  }
  mergeIn(other, predicate) {
    const path = other.compile();
    this.builder.mergeIn(path.builder, predicate);
  }
  static unwrapFieldPath(formPath) {
    return formPath[PATH];
  }
  static newRoot() {
    return new _FieldPathNode([], void 0, void 0, void 0);
  }
};
var FIELD_PATH_PROXY_HANDLER = {
  get(node, property) {
    if (property === PATH) {
      return node;
    }
    return node.getChild(property).fieldPathProxy;
  }
};
var currentCompilingNode = void 0;
var compiledSchemas = /* @__PURE__ */ new Map();
var SchemaImpl = class _SchemaImpl {
  schemaFn;
  constructor(schemaFn) {
    this.schemaFn = schemaFn;
  }
  compile() {
    if (compiledSchemas.has(this)) {
      return compiledSchemas.get(this);
    }
    const path = FieldPathNode.newRoot();
    compiledSchemas.set(this, path);
    let prevCompilingNode = currentCompilingNode;
    try {
      currentCompilingNode = path;
      this.schemaFn(path.fieldPathProxy);
    } finally {
      currentCompilingNode = prevCompilingNode;
    }
    return path;
  }
  static create(schema2) {
    if (schema2 instanceof _SchemaImpl) {
      return schema2;
    }
    return new _SchemaImpl(schema2);
  }
  static rootCompile(schema2) {
    try {
      compiledSchemas.clear();
      if (schema2 === void 0) {
        return FieldPathNode.newRoot();
      }
      if (schema2 instanceof _SchemaImpl) {
        return schema2.compile();
      }
      return new _SchemaImpl(schema2).compile();
    } finally {
      compiledSchemas.clear();
    }
  }
};
function isSchemaOrSchemaFn(value) {
  return value instanceof SchemaImpl || typeof value === "function";
}
function assertPathIsCurrent(path) {
  if (currentCompilingNode !== FieldPathNode.unwrapFieldPath(path).root) {
    throw new RuntimeError(1908, ngDevMode && `A FieldPath can only be used directly within the Schema that owns it, **not** outside of it or within a sub-schema.`);
  }
}
function metadata(path, key, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addMetadataRule(key, logic);
  return key;
}
var MetadataReducer = {
  list() {
    return {
      reduce: (acc, item) => item === void 0 ? acc : [...acc, item],
      getInitial: () => []
    };
  },
  min() {
    return {
      reduce: (acc, item) => {
        if (acc === void 0 || item === void 0) {
          return acc ?? item;
        }
        return Math.min(acc, item);
      },
      getInitial: () => void 0
    };
  },
  max() {
    return {
      reduce: (prev, next) => {
        if (prev === void 0 || next === void 0) {
          return prev ?? next;
        }
        return Math.max(prev, next);
      },
      getInitial: () => void 0
    };
  },
  or() {
    return {
      reduce: (prev, next) => prev || next,
      getInitial: () => false
    };
  },
  and() {
    return {
      reduce: (prev, next) => prev && next,
      getInitial: () => true
    };
  },
  override
};
function override(getInitial) {
  return {
    reduce: (_, item) => item,
    getInitial: () => getInitial?.()
  };
}
var MetadataKey = class {
  reducer;
  create;
  brand;
  constructor(reducer, create) {
    this.reducer = reducer;
    this.create = create;
  }
};
function createMetadataKey(reducer) {
  return new MetadataKey(reducer ?? MetadataReducer.override());
}
function createManagedMetadataKey(create, reducer) {
  return new MetadataKey(reducer ?? MetadataReducer.override(), create);
}
var REQUIRED = createMetadataKey(MetadataReducer.or());
var MIN = createMetadataKey(MetadataReducer.max());
var MAX = createMetadataKey(MetadataReducer.min());
var MIN_LENGTH = createMetadataKey(MetadataReducer.max());
var MAX_LENGTH = createMetadataKey(MetadataReducer.min());
var PATTERN = createMetadataKey(MetadataReducer.list());
function calculateValidationSelfStatus(state) {
  if (state.errors().length > 0) {
    return "invalid";
  }
  if (state.pending()) {
    return "unknown";
  }
  return "valid";
}
var FieldValidationState = class {
  node;
  constructor(node) {
    this.node = node;
  }
  rawSyncTreeErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.syncTreeErrors.compute(this.node.context), ...this.node.structure.parent?.validationState.rawSyncTreeErrors() ?? []];
  }, ...ngDevMode ? [{
    debugName: "rawSyncTreeErrors"
  }] : []);
  syncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.syncErrors.compute(this.node.context), ...this.syncTreeErrors(), ...normalizeErrors(this.node.submitState.submissionErrors())];
  }, ...ngDevMode ? [{
    debugName: "syncErrors"
  }] : []);
  syncValid = computed(() => {
    if (this.shouldSkipValidation()) {
      return true;
    }
    return this.node.structure.reduceChildren(this.syncErrors().length === 0, (child, value) => value && child.validationState.syncValid(), shortCircuitFalse);
  }, ...ngDevMode ? [{
    debugName: "syncValid"
  }] : []);
  syncTreeErrors = computed(() => this.rawSyncTreeErrors().filter((err) => err.fieldTree === this.node.fieldProxy), ...ngDevMode ? [{
    debugName: "syncTreeErrors"
  }] : []);
  rawAsyncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.asyncErrors.compute(this.node.context), ...this.node.structure.parent?.validationState.rawAsyncErrors() ?? []];
  }, ...ngDevMode ? [{
    debugName: "rawAsyncErrors"
  }] : []);
  asyncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return this.rawAsyncErrors().filter((err) => err === "pending" || err.fieldTree === this.node.fieldProxy);
  }, ...ngDevMode ? [{
    debugName: "asyncErrors"
  }] : []);
  errors = computed(() => [...this.syncErrors(), ...this.asyncErrors().filter((err) => err !== "pending")], ...ngDevMode ? [{
    debugName: "errors"
  }] : []);
  errorSummary = computed(() => this.node.structure.reduceChildren(this.errors(), (child, result) => [...result, ...child.errorSummary()]), ...ngDevMode ? [{
    debugName: "errorSummary"
  }] : []);
  pending = computed(() => this.node.structure.reduceChildren(this.asyncErrors().includes("pending"), (child, value) => value || child.validationState.asyncErrors().includes("pending")), ...ngDevMode ? [{
    debugName: "pending"
  }] : []);
  status = computed(() => {
    if (this.shouldSkipValidation()) {
      return "valid";
    }
    let ownStatus = calculateValidationSelfStatus(this);
    return this.node.structure.reduceChildren(ownStatus, (child, value) => {
      if (value === "invalid" || child.validationState.status() === "invalid") {
        return "invalid";
      } else if (value === "unknown" || child.validationState.status() === "unknown") {
        return "unknown";
      }
      return "valid";
    }, (v) => v === "invalid");
  }, ...ngDevMode ? [{
    debugName: "status"
  }] : []);
  valid = computed(() => this.status() === "valid", ...ngDevMode ? [{
    debugName: "valid"
  }] : []);
  invalid = computed(() => this.status() === "invalid", ...ngDevMode ? [{
    debugName: "invalid"
  }] : []);
  shouldSkipValidation = computed(() => this.node.hidden() || this.node.disabled() || this.node.readonly(), ...ngDevMode ? [{
    debugName: "shouldSkipValidation"
  }] : []);
};
function normalizeErrors(error) {
  if (error === void 0) {
    return [];
  }
  if (isArray(error)) {
    return error;
  }
  return [error];
}
function addDefaultField(errors, fieldTree) {
  if (isArray(errors)) {
    for (const error of errors) {
      error.fieldTree ??= fieldTree;
    }
  } else if (errors) {
    errors.fieldTree ??= fieldTree;
  }
  return errors;
}
var DEBOUNCER = createMetadataKey();
var FieldNodeContext = class {
  node;
  cache = /* @__PURE__ */ new WeakMap();
  constructor(node) {
    this.node = node;
  }
  resolve(target) {
    if (!this.cache.has(target)) {
      const resolver = computed(() => {
        const targetPathNode = FieldPathNode.unwrapFieldPath(target);
        let field = this.node;
        let stepsRemaining = getBoundPathDepth();
        while (stepsRemaining > 0 || !field.structure.logic.hasLogic(targetPathNode.root.builder)) {
          stepsRemaining--;
          field = field.structure.parent;
          if (field === void 0) {
            throw new RuntimeError(1900, ngDevMode && "Path is not part of this field tree.");
          }
        }
        for (let key of targetPathNode.keys) {
          field = field.structure.getChild(key);
          if (field === void 0) {
            throw new RuntimeError(1901, ngDevMode && `Cannot resolve path .${targetPathNode.keys.join(".")} relative to field ${["<root>", ...this.node.structure.pathKeys()].join(".")}.`);
          }
        }
        return field.fieldProxy;
      }, ...ngDevMode ? [{
        debugName: "resolver"
      }] : []);
      this.cache.set(target, resolver);
    }
    return this.cache.get(target)();
  }
  get fieldTree() {
    return this.node.fieldProxy;
  }
  get state() {
    return this.node;
  }
  get value() {
    return this.node.structure.value;
  }
  get key() {
    return this.node.structure.keyInParent;
  }
  get pathKeys() {
    return this.node.structure.pathKeys;
  }
  index = computed(() => {
    const key = this.key();
    if (!isArray(untracked(this.node.structure.parent.value))) {
      throw new RuntimeError(1906, ngDevMode && "Cannot access index, parent field is not an array.");
    }
    return Number(key);
  }, ...ngDevMode ? [{
    debugName: "index"
  }] : []);
  fieldTreeOf = (p) => this.resolve(p);
  stateOf = (p) => this.resolve(p)();
  valueOf = (p) => {
    const result = this.resolve(p)().value();
    if (result instanceof AbstractControl) {
      throw new RuntimeError(1907, ngDevMode && `Tried to read an 'AbstractControl' value from a 'form()'. Did you mean to use 'compatForm()' instead?`);
    }
    return result;
  };
};
var FieldMetadataState = class {
  node;
  metadata = /* @__PURE__ */ new Map();
  constructor(node) {
    this.node = node;
    for (const key of this.node.logicNode.logic.getMetadataKeys()) {
      if (key.create) {
        const logic = this.node.logicNode.logic.getMetadata(key);
        const result = untracked(() => runInInjectionContext(this.node.structure.injector, () => key.create(computed(() => logic.compute(this.node.context)))));
        this.metadata.set(key, result);
      }
    }
  }
  get(key) {
    if (this.has(key)) {
      if (!this.metadata.has(key)) {
        if (key.create) {
          throw new RuntimeError(1912, ngDevMode && "Managed metadata cannot be created lazily");
        }
        const logic = this.node.logicNode.logic.getMetadata(key);
        this.metadata.set(key, computed(() => logic.compute(this.node.context)));
      }
    }
    return this.metadata.get(key);
  }
  has(key) {
    return this.node.logicNode.logic.hasMetadata(key);
  }
};
var FIELD_PROXY_HANDLER = {
  get(getTgt, p, receiver) {
    const tgt = getTgt();
    const child = tgt.structure.getChild(p);
    if (child !== void 0) {
      return child.fieldProxy;
    }
    const value = untracked(tgt.value);
    if (isArray(value)) {
      if (p === "length") {
        return tgt.value().length;
      }
      if (p === Symbol.iterator) {
        return () => {
          tgt.value();
          return Array.prototype[Symbol.iterator].apply(tgt.fieldProxy);
        };
      }
    }
    if (isObject(value)) {
      if (p === Symbol.iterator) {
        return function* () {
          for (const key in receiver) {
            yield [key, receiver[key]];
          }
        };
      }
    }
    return void 0;
  },
  getOwnPropertyDescriptor(getTgt, prop) {
    const value = untracked(getTgt().value);
    const desc = Reflect.getOwnPropertyDescriptor(value, prop);
    if (desc && !desc.configurable) {
      desc.configurable = true;
    }
    return desc;
  },
  ownKeys(getTgt) {
    const value = untracked(getTgt().value);
    return typeof value === "object" && value !== null ? Reflect.ownKeys(value) : [];
  }
};
function deepSignal(source, prop) {
  const read = computed(() => source()[prop()]);
  read[SIGNAL] = source[SIGNAL];
  read.set = (value) => {
    source.update((current) => valueForWrite(current, value, prop()));
  };
  read.update = (fn) => {
    read.set(fn(untracked(read)));
  };
  read.asReadonly = () => read;
  return read;
}
function valueForWrite(sourceValue, newPropValue, prop) {
  if (isArray(sourceValue)) {
    const newValue = [...sourceValue];
    newValue[prop] = newPropValue;
    return newValue;
  } else {
    return __spreadProps(__spreadValues({}, sourceValue), {
      [prop]: newPropValue
    });
  }
}
var FieldNodeStructure = class {
  logic;
  node;
  createChildNode;
  identitySymbol = Symbol();
  _injector = void 0;
  get injector() {
    this._injector ??= Injector.create({
      providers: [],
      parent: this.fieldManager.injector
    });
    return this._injector;
  }
  constructor(logic, node, createChildNode) {
    this.logic = logic;
    this.node = node;
    this.createChildNode = createChildNode;
  }
  children() {
    const map = this.childrenMap();
    if (map === void 0) {
      return [];
    }
    return Array.from(map.byPropertyKey.values()).map((child) => untracked(child.reader));
  }
  getChild(key) {
    const strKey = key.toString();
    let reader = untracked(this.childrenMap)?.byPropertyKey.get(strKey)?.reader;
    if (!reader) {
      reader = this.createReader(strKey);
    }
    return reader();
  }
  reduceChildren(initialValue, fn, shortCircuit) {
    const map = this.childrenMap();
    if (!map) {
      return initialValue;
    }
    let value = initialValue;
    for (const child of map.byPropertyKey.values()) {
      if (shortCircuit?.(value)) {
        break;
      }
      value = fn(untracked(child.reader), value);
    }
    return value;
  }
  destroy() {
    this.injector.destroy();
  }
  createKeyInParent(options, identityInParent, initialKeyInParent) {
    if (options.kind === "root") {
      return ROOT_KEY_IN_PARENT;
    }
    if (identityInParent === void 0) {
      const key = initialKeyInParent;
      return computed(() => {
        if (this.parent.structure.getChild(key) !== this.node) {
          throw new RuntimeError(1902, ngDevMode && `Orphan field, looking for property '${key}' of ${getDebugName(this.parent)}`);
        }
        return key;
      });
    } else {
      let lastKnownKey = initialKeyInParent;
      return computed(() => {
        const parentValue = this.parent.structure.value();
        if (!isArray(parentValue)) {
          throw new RuntimeError(1903, ngDevMode && `Orphan field, expected ${getDebugName(this.parent)} to be an array`);
        }
        const data = parentValue[lastKnownKey];
        if (isObject(data) && data.hasOwnProperty(this.parent.structure.identitySymbol) && data[this.parent.structure.identitySymbol] === identityInParent) {
          return lastKnownKey;
        }
        for (let i = 0; i < parentValue.length; i++) {
          const data2 = parentValue[i];
          if (isObject(data2) && data2.hasOwnProperty(this.parent.structure.identitySymbol) && data2[this.parent.structure.identitySymbol] === identityInParent) {
            return lastKnownKey = i.toString();
          }
        }
        throw new RuntimeError(1904, ngDevMode && `Orphan field, can't find element in array ${getDebugName(this.parent)}`);
      });
    }
  }
  createChildrenMap() {
    return linkedSignal({
      source: this.value,
      computation: (value, previous) => {
        if (!isObject(value)) {
          return void 0;
        }
        const prevData = previous?.value ?? {
          byPropertyKey: /* @__PURE__ */ new Map()
        };
        let data;
        const parentIsArray = isArray(value);
        if (prevData !== void 0) {
          if (parentIsArray) {
            data = maybeRemoveStaleArrayFields(prevData, value, this.identitySymbol);
          } else {
            data = maybeRemoveStaleObjectFields(prevData, value);
          }
        }
        for (const key of Object.keys(value)) {
          let trackingKey = void 0;
          const childValue = value[key];
          if (childValue === void 0) {
            if (prevData.byPropertyKey.has(key)) {
              data ??= __spreadValues({}, prevData);
              data.byPropertyKey.delete(key);
            }
            continue;
          }
          if (parentIsArray && isObject(childValue) && !isArray(childValue)) {
            trackingKey = childValue[this.identitySymbol] ??= Symbol(ngDevMode ? `id:${globalId++}` : "");
          }
          let childNode;
          if (trackingKey) {
            if (!prevData.byTrackingKey?.has(trackingKey)) {
              data ??= __spreadValues({}, prevData);
              data.byTrackingKey ??= /* @__PURE__ */ new Map();
              data.byTrackingKey.set(trackingKey, this.createChildNode(key, trackingKey, parentIsArray));
            }
            childNode = (data ?? prevData).byTrackingKey.get(trackingKey);
          }
          const child = prevData.byPropertyKey.get(key);
          if (child === void 0) {
            data ??= __spreadValues({}, prevData);
            data.byPropertyKey.set(key, {
              reader: this.createReader(key),
              node: childNode ?? this.createChildNode(key, trackingKey, parentIsArray)
            });
          } else if (childNode && childNode !== child.node) {
            data ??= __spreadValues({}, prevData);
            child.node = childNode;
          }
        }
        return data ?? prevData;
      }
    });
  }
  createReader(key) {
    return computed(() => this.childrenMap()?.byPropertyKey.get(key)?.node);
  }
};
var RootFieldNodeStructure = class extends FieldNodeStructure {
  fieldManager;
  value;
  get parent() {
    return void 0;
  }
  get root() {
    return this.node;
  }
  get pathKeys() {
    return ROOT_PATH_KEYS;
  }
  get keyInParent() {
    return ROOT_KEY_IN_PARENT;
  }
  childrenMap;
  constructor(node, logic, fieldManager, value, createChildNode) {
    super(logic, node, createChildNode);
    this.fieldManager = fieldManager;
    this.value = value;
    this.childrenMap = this.createChildrenMap();
  }
};
var ChildFieldNodeStructure = class extends FieldNodeStructure {
  logic;
  parent;
  root;
  pathKeys;
  keyInParent;
  value;
  childrenMap;
  get fieldManager() {
    return this.root.structure.fieldManager;
  }
  constructor(node, logic, parent, identityInParent, initialKeyInParent, createChildNode) {
    super(logic, node, createChildNode);
    this.logic = logic;
    this.parent = parent;
    this.root = this.parent.structure.root;
    this.keyInParent = this.createKeyInParent({
      kind: "child",
      parent,
      pathNode: void 0,
      logic,
      initialKeyInParent,
      identityInParent,
      fieldAdapter: void 0
    }, identityInParent, initialKeyInParent);
    this.pathKeys = computed(() => [...parent.structure.pathKeys(), this.keyInParent()], ...ngDevMode ? [{
      debugName: "pathKeys"
    }] : []);
    this.value = deepSignal(this.parent.structure.value, this.keyInParent);
    this.childrenMap = this.createChildrenMap();
    this.fieldManager.structures.add(this);
  }
};
var globalId = 0;
var ROOT_PATH_KEYS = computed(() => [], ...ngDevMode ? [{
  debugName: "ROOT_PATH_KEYS"
}] : []);
var ROOT_KEY_IN_PARENT = computed(() => {
  throw new RuntimeError(1905, ngDevMode && "The top-level field in the form has no parent.");
}, ...ngDevMode ? [{
  debugName: "ROOT_KEY_IN_PARENT"
}] : []);
function getDebugName(node) {
  return `<root>.${node.structure.pathKeys().join(".")}`;
}
function maybeRemoveStaleArrayFields(prevData, value, identitySymbol) {
  let data;
  const oldKeys = new Set(prevData.byPropertyKey.keys());
  const oldTracking = new Set(prevData.byTrackingKey?.keys());
  for (let i = 0; i < value.length; i++) {
    const childValue = value[i];
    oldKeys.delete(i.toString());
    if (isObject(childValue) && childValue.hasOwnProperty(identitySymbol)) {
      oldTracking.delete(childValue[identitySymbol]);
    }
  }
  if (oldKeys.size > 0) {
    data ??= __spreadValues({}, prevData);
    for (const key of oldKeys) {
      data.byPropertyKey.delete(key);
    }
  }
  if (oldTracking.size > 0) {
    data ??= __spreadValues({}, prevData);
    for (const id of oldTracking) {
      data.byTrackingKey?.delete(id);
    }
  }
  return data;
}
function maybeRemoveStaleObjectFields(prevData, value) {
  let data;
  for (const key of prevData.byPropertyKey.keys()) {
    if (!value.hasOwnProperty(key)) {
      data ??= __spreadValues({}, prevData);
      data.byPropertyKey.delete(key);
    }
  }
  return data;
}
var FieldSubmitState = class {
  node;
  selfSubmitting = signal(false, ...ngDevMode ? [{
    debugName: "selfSubmitting"
  }] : []);
  submissionErrors;
  constructor(node) {
    this.node = node;
    this.submissionErrors = linkedSignal(__spreadProps(__spreadValues({}, ngDevMode ? {
      debugName: "submissionErrors"
    } : {}), {
      source: this.node.structure.value,
      computation: () => []
    }));
  }
  submitting = computed(() => {
    return this.selfSubmitting() || (this.node.structure.parent?.submitting() ?? false);
  }, ...ngDevMode ? [{
    debugName: "submitting"
  }] : []);
};
var FieldNode = class {
  structure;
  validationState;
  metadataState;
  nodeState;
  submitState;
  fieldAdapter;
  _context = void 0;
  get context() {
    return this._context ??= new FieldNodeContext(this);
  }
  fieldProxy = new Proxy(() => this, FIELD_PROXY_HANDLER);
  pathNode;
  constructor(options) {
    this.pathNode = options.pathNode;
    this.fieldAdapter = options.fieldAdapter;
    this.structure = this.fieldAdapter.createStructure(this, options);
    this.validationState = this.fieldAdapter.createValidationState(this, options);
    this.nodeState = this.fieldAdapter.createNodeState(this, options);
    this.metadataState = new FieldMetadataState(this);
    this.submitState = new FieldSubmitState(this);
  }
  pendingSync = linkedSignal(__spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "pendingSync"
  } : {}), {
    source: () => this.value(),
    computation: (_source, previous) => {
      previous?.value?.abort();
      return void 0;
    }
  }));
  get logicNode() {
    return this.structure.logic;
  }
  get value() {
    return this.structure.value;
  }
  _controlValue = linkedSignal(() => this.value(), ...ngDevMode ? [{
    debugName: "_controlValue"
  }] : []);
  get controlValue() {
    return this._controlValue.asReadonly();
  }
  get keyInParent() {
    return this.structure.keyInParent;
  }
  get errors() {
    return this.validationState.errors;
  }
  get errorSummary() {
    return this.validationState.errorSummary;
  }
  get pending() {
    return this.validationState.pending;
  }
  get valid() {
    return this.validationState.valid;
  }
  get invalid() {
    return this.validationState.invalid;
  }
  get dirty() {
    return this.nodeState.dirty;
  }
  get touched() {
    return this.nodeState.touched;
  }
  get disabled() {
    return this.nodeState.disabled;
  }
  get disabledReasons() {
    return this.nodeState.disabledReasons;
  }
  get hidden() {
    return this.nodeState.hidden;
  }
  get readonly() {
    return this.nodeState.readonly;
  }
  get formFieldBindings() {
    return this.nodeState.formFieldBindings;
  }
  get submitting() {
    return this.submitState.submitting;
  }
  get name() {
    return this.nodeState.name;
  }
  get max() {
    return this.metadata(MAX);
  }
  get maxLength() {
    return this.metadata(MAX_LENGTH);
  }
  get min() {
    return this.metadata(MIN);
  }
  get minLength() {
    return this.metadata(MIN_LENGTH);
  }
  get pattern() {
    return this.metadata(PATTERN) ?? EMPTY;
  }
  get required() {
    return this.metadata(REQUIRED) ?? FALSE;
  }
  metadata(key) {
    return this.metadataState.get(key);
  }
  hasMetadata(key) {
    return this.metadataState.has(key);
  }
  markAsTouched() {
    this.nodeState.markAsTouched();
    this.pendingSync()?.abort();
    this.sync();
  }
  markAsDirty() {
    this.nodeState.markAsDirty();
  }
  reset(value) {
    untracked(() => this._reset(value));
  }
  _reset(value) {
    if (value !== void 0) {
      this.value.set(value);
    }
    this.nodeState.markAsUntouched();
    this.nodeState.markAsPristine();
    for (const child of this.structure.children()) {
      child._reset();
    }
  }
  setControlValue(newValue) {
    this._controlValue.set(newValue);
    this.markAsDirty();
    this.debounceSync();
  }
  sync() {
    this.value.set(this.controlValue());
  }
  async debounceSync() {
    this.pendingSync()?.abort();
    const debouncer = this.nodeState.debouncer();
    if (debouncer) {
      const controller = new AbortController();
      const promise = debouncer(controller.signal);
      if (promise) {
        this.pendingSync.set(controller);
        await promise;
        if (controller.signal.aborted) {
          return;
        }
      }
    }
    this.sync();
  }
  static newRoot(fieldManager, value, pathNode, adapter) {
    return adapter.newRoot(fieldManager, value, pathNode, adapter);
  }
  createStructure(options) {
    return options.kind === "root" ? new RootFieldNodeStructure(this, options.logic, options.fieldManager, options.value, this.newChild.bind(this)) : new ChildFieldNodeStructure(this, options.logic, options.parent, options.identityInParent, options.initialKeyInParent, this.newChild.bind(this));
  }
  newChild(key, trackingId, isArray2) {
    let childPath;
    let childLogic;
    if (isArray2) {
      childPath = this.pathNode.getChild(DYNAMIC);
      childLogic = this.structure.logic.getChild(DYNAMIC);
    } else {
      childPath = this.pathNode.getChild(key);
      childLogic = this.structure.logic.getChild(key);
    }
    return this.fieldAdapter.newChild({
      kind: "child",
      parent: this,
      pathNode: childPath,
      logic: childLogic,
      initialKeyInParent: key,
      identityInParent: trackingId,
      fieldAdapter: this.fieldAdapter
    });
  }
};
var EMPTY = computed(() => [], ...ngDevMode ? [{
  debugName: "EMPTY"
}] : []);
var FALSE = computed(() => false, ...ngDevMode ? [{
  debugName: "FALSE"
}] : []);
var FieldNodeState = class {
  node;
  selfTouched = signal(false, ...ngDevMode ? [{
    debugName: "selfTouched"
  }] : []);
  selfDirty = signal(false, ...ngDevMode ? [{
    debugName: "selfDirty"
  }] : []);
  markAsTouched() {
    this.selfTouched.set(true);
  }
  markAsDirty() {
    this.selfDirty.set(true);
  }
  markAsPristine() {
    this.selfDirty.set(false);
  }
  markAsUntouched() {
    this.selfTouched.set(false);
  }
  formFieldBindings = signal([], ...ngDevMode ? [{
    debugName: "formFieldBindings"
  }] : []);
  constructor(node) {
    this.node = node;
  }
  dirty = computed(() => {
    const selfDirtyValue = this.selfDirty() && !this.isNonInteractive();
    return this.node.structure.reduceChildren(selfDirtyValue, (child, value) => value || child.nodeState.dirty(), shortCircuitTrue);
  }, ...ngDevMode ? [{
    debugName: "dirty"
  }] : []);
  touched = computed(() => {
    const selfTouchedValue = this.selfTouched() && !this.isNonInteractive();
    return this.node.structure.reduceChildren(selfTouchedValue, (child, value) => value || child.nodeState.touched(), shortCircuitTrue);
  }, ...ngDevMode ? [{
    debugName: "touched"
  }] : []);
  disabledReasons = computed(() => [...this.node.structure.parent?.nodeState.disabledReasons() ?? [], ...this.node.logicNode.logic.disabledReasons.compute(this.node.context)], ...ngDevMode ? [{
    debugName: "disabledReasons"
  }] : []);
  disabled = computed(() => !!this.disabledReasons().length, ...ngDevMode ? [{
    debugName: "disabled"
  }] : []);
  readonly = computed(() => (this.node.structure.parent?.nodeState.readonly() || this.node.logicNode.logic.readonly.compute(this.node.context)) ?? false, ...ngDevMode ? [{
    debugName: "readonly"
  }] : []);
  hidden = computed(() => (this.node.structure.parent?.nodeState.hidden() || this.node.logicNode.logic.hidden.compute(this.node.context)) ?? false, ...ngDevMode ? [{
    debugName: "hidden"
  }] : []);
  name = computed(() => {
    const parent = this.node.structure.parent;
    if (!parent) {
      return this.node.structure.fieldManager.rootName;
    }
    return `${parent.name()}.${this.node.structure.keyInParent()}`;
  }, ...ngDevMode ? [{
    debugName: "name"
  }] : []);
  debouncer = computed(() => {
    if (this.node.logicNode.logic.hasMetadata(DEBOUNCER)) {
      const debouncerLogic = this.node.logicNode.logic.getMetadata(DEBOUNCER);
      const debouncer = debouncerLogic.compute(this.node.context);
      if (debouncer) {
        return (signal2) => debouncer(this.node.context, signal2);
      }
    }
    return this.node.structure.parent?.nodeState.debouncer?.();
  }, ...ngDevMode ? [{
    debugName: "debouncer"
  }] : []);
  isNonInteractive = computed(() => this.hidden() || this.disabled() || this.readonly(), ...ngDevMode ? [{
    debugName: "isNonInteractive"
  }] : []);
};
var BasicFieldAdapter = class {
  newRoot(fieldManager, value, pathNode, adapter) {
    return new FieldNode({
      kind: "root",
      fieldManager,
      value,
      pathNode,
      logic: pathNode.builder.build(),
      fieldAdapter: adapter
    });
  }
  newChild(options) {
    return new FieldNode(options);
  }
  createNodeState(node) {
    return new FieldNodeState(node);
  }
  createValidationState(node) {
    return new FieldValidationState(node);
  }
  createStructure(node, options) {
    return node.createStructure(options);
  }
};
var FormFieldManager = class {
  injector;
  rootName;
  constructor(injector, rootName) {
    this.injector = injector;
    this.rootName = rootName ?? `${this.injector.get(APP_ID)}.form${nextFormId++}`;
  }
  structures = /* @__PURE__ */ new Set();
  createFieldManagementEffect(root) {
    effect(() => {
      const liveStructures = /* @__PURE__ */ new Set();
      this.markStructuresLive(root, liveStructures);
      for (const structure of this.structures) {
        if (!liveStructures.has(structure)) {
          this.structures.delete(structure);
          untracked(() => structure.destroy());
        }
      }
    }, {
      injector: this.injector
    });
  }
  markStructuresLive(structure, liveStructures) {
    liveStructures.add(structure);
    for (const child of structure.children()) {
      this.markStructuresLive(child.structure, liveStructures);
    }
  }
};
var nextFormId = 0;
function normalizeFormArgs(args) {
  let model;
  let schema2;
  let options;
  if (args.length === 3) {
    [model, schema2, options] = args;
  } else if (args.length === 2) {
    if (isSchemaOrSchemaFn(args[1])) {
      [model, schema2] = args;
    } else {
      [model, options] = args;
    }
  } else {
    [model] = args;
  }
  return [model, schema2, options];
}
function form(...args) {
  const [model, schema2, options] = normalizeFormArgs(args);
  const injector = options?.injector ?? inject(Injector);
  const pathNode = runInInjectionContext(injector, () => SchemaImpl.rootCompile(schema2));
  const fieldManager = new FormFieldManager(injector, options?.name);
  const adapter = options?.adapter ?? new BasicFieldAdapter();
  const fieldRoot = FieldNode.newRoot(fieldManager, model, pathNode, adapter);
  fieldManager.createFieldManagementEffect(fieldRoot.structure);
  return fieldRoot.fieldProxy;
}
function applyEach(path, schema2) {
  assertPathIsCurrent(path);
  const elementPath = FieldPathNode.unwrapFieldPath(path).getChild(DYNAMIC).fieldPathProxy;
  apply(elementPath, schema2);
}
function apply(path, schema2) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.mergeIn(SchemaImpl.create(schema2));
}
function applyWhen(path, logic, schema2) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.mergeIn(SchemaImpl.create(schema2), {
    fn: logic,
    path
  });
}
function applyWhenValue(path, predicate, schema2) {
  applyWhen(path, ({
    value
  }) => predicate(value()), schema2);
}
async function submit(form2, action) {
  const node = form2();
  markAllAsTouched(node);
  if (node.invalid()) {
    return;
  }
  node.submitState.selfSubmitting.set(true);
  try {
    const errors = await action(form2);
    errors && setSubmissionErrors(node, errors);
  } finally {
    node.submitState.selfSubmitting.set(false);
  }
}
function setSubmissionErrors(submittedField, errors) {
  if (!isArray(errors)) {
    errors = [errors];
  }
  const errorsByField = /* @__PURE__ */ new Map();
  for (const error of errors) {
    const errorWithField = addDefaultField(error, submittedField.fieldProxy);
    const field = errorWithField.fieldTree();
    let fieldErrors = errorsByField.get(field);
    if (!fieldErrors) {
      fieldErrors = [];
      errorsByField.set(field, fieldErrors);
    }
    fieldErrors.push(errorWithField);
  }
  for (const [field, fieldErrors] of errorsByField) {
    field.submitState.submissionErrors.set(fieldErrors);
  }
}
function schema(fn) {
  return SchemaImpl.create(fn);
}
function markAllAsTouched(node) {
  node.markAsTouched();
  for (const child of node.structure.children()) {
    markAllAsTouched(child);
  }
}

// node_modules/@angular/forms/fesm2022/signals.mjs
var SIGNAL_FORMS_CONFIG = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "SIGNAL_FORMS_CONFIG" : "");
function provideSignalFormsConfig(config) {
  return [{
    provide: SIGNAL_FORMS_CONFIG,
    useValue: config
  }];
}
var InteropNgControl = class {
  field;
  constructor(field) {
    this.field = field;
  }
  control = this;
  get value() {
    return this.field().value();
  }
  get valid() {
    return this.field().valid();
  }
  get invalid() {
    return this.field().invalid();
  }
  get pending() {
    return this.field().pending();
  }
  get disabled() {
    return this.field().disabled();
  }
  get enabled() {
    return !this.field().disabled();
  }
  get errors() {
    const errors = this.field().errors();
    if (errors.length === 0) {
      return null;
    }
    const errObj = {};
    for (const error of errors) {
      errObj[error.kind] = error;
    }
    return errObj;
  }
  get pristine() {
    return !this.field().dirty();
  }
  get dirty() {
    return this.field().dirty();
  }
  get touched() {
    return this.field().touched();
  }
  get untouched() {
    return !this.field().touched();
  }
  get status() {
    if (this.field().disabled()) {
      return "DISABLED";
    }
    if (this.field().valid()) {
      return "VALID";
    }
    if (this.field().invalid()) {
      return "INVALID";
    }
    if (this.field().pending()) {
      return "PENDING";
    }
    throw new RuntimeError(1910, ngDevMode && "Unknown form control status");
  }
  valueAccessor = null;
  hasValidator(validator) {
    if (validator === Validators.required) {
      return this.field().required();
    }
    return false;
  }
  updateValueAndValidity() {
  }
};
var FIELD = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "FIELD" : "");
var controlInstructions$1 = {
  create: ɵɵcontrolCreate,
  update: ɵcontrolUpdate
};
var Field = class _Field {
  element = inject(ElementRef).nativeElement;
  injector = inject(Injector);
  field = input.required(...ngDevMode ? [{
    debugName: "field"
  }] : []);
  state = computed(() => this.field()(), ...ngDevMode ? [{
    debugName: "state"
  }] : []);
  [ɵCONTROL] = controlInstructions$1;
  config = inject(SIGNAL_FORMS_CONFIG, {
    optional: true
  });
  classes = Object.entries(this.config?.classes ?? {}).map(([className, computation]) => [className, computed(() => computation(this))]);
  controlValueAccessors = inject(NG_VALUE_ACCESSOR, {
    optional: true,
    self: true
  });
  interopNgControl;
  get ɵinteropControl() {
    return this.controlValueAccessors?.[0] ?? this.interopNgControl?.valueAccessor ?? void 0;
  }
  getOrCreateNgControl() {
    return this.interopNgControl ??= new InteropNgControl(this.state);
  }
  ɵregister() {
    effect((onCleanup) => {
      const fieldNode = this.state();
      fieldNode.nodeState.formFieldBindings.update((controls) => [...controls, this]);
      onCleanup(() => {
        fieldNode.nodeState.formFieldBindings.update((controls) => controls.filter((c) => c !== this));
      });
    }, {
      injector: this.injector
    });
  }
  static ɵfac = function Field_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Field)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _Field,
    selectors: [["", "field", ""]],
    inputs: {
      field: [1, "field"]
    },
    features: [ɵɵProvidersFeature([{
      provide: FIELD,
      useExisting: _Field
    }, {
      provide: NgControl,
      useFactory: () => inject(_Field).getOrCreateNgControl()
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Field, [{
    type: Directive,
    args: [{
      selector: "[field]",
      providers: [{
        provide: FIELD,
        useExisting: Field
      }, {
        provide: NgControl,
        useFactory: () => inject(Field).getOrCreateNgControl()
      }]
    }]
  }], null, {
    field: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "field",
        required: true
      }]
    }]
  });
})();
var FORM_FIELD = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "FORM_FIELD" : "");
var controlInstructions = {
  create: ɵɵcontrolCreate,
  update: ɵcontrolUpdate
};
var FormField = class _FormField {
  element = inject(ElementRef).nativeElement;
  injector = inject(Injector);
  formField = input.required(...ngDevMode ? [{
    debugName: "formField"
  }] : []);
  state = computed(() => this.formField()(), ...ngDevMode ? [{
    debugName: "state"
  }] : []);
  [ɵCONTROL] = controlInstructions;
  config = inject(SIGNAL_FORMS_CONFIG, {
    optional: true
  });
  classes = Object.entries(this.config?.classes ?? {}).map(([className, computation]) => [className, computed(() => computation(this))]);
  controlValueAccessors = inject(NG_VALUE_ACCESSOR, {
    optional: true,
    self: true
  });
  interopNgControl;
  get ɵinteropControl() {
    return this.controlValueAccessors?.[0] ?? this.interopNgControl?.valueAccessor ?? void 0;
  }
  getOrCreateNgControl() {
    return this.interopNgControl ??= new InteropNgControl(this.state);
  }
  ɵregister() {
    effect((onCleanup) => {
      const fieldNode = this.state();
      fieldNode.nodeState.formFieldBindings.update((controls) => [...controls, this]);
      onCleanup(() => {
        fieldNode.nodeState.formFieldBindings.update((controls) => controls.filter((c) => c !== this));
      });
    }, {
      injector: this.injector
    });
  }
  static ɵfac = function FormField_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormField)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _FormField,
    selectors: [["", "formField", ""]],
    inputs: {
      formField: [1, "formField"]
    },
    features: [ɵɵProvidersFeature([{
      provide: FORM_FIELD,
      useExisting: _FormField
    }, {
      provide: NgControl,
      useFactory: () => inject(_FormField).getOrCreateNgControl()
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormField, [{
    type: Directive,
    args: [{
      selector: "[formField]",
      providers: [{
        provide: FORM_FIELD,
        useExisting: FormField
      }, {
        provide: NgControl,
        useFactory: () => inject(FormField).getOrCreateNgControl()
      }]
    }]
  }], null, {
    formField: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "formField",
        required: true
      }]
    }]
  });
})();
function disabled(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addDisabledReasonRule((ctx) => {
    let result = true;
    if (typeof logic === "string") {
      result = logic;
    } else if (logic) {
      result = logic(ctx);
    }
    if (typeof result === "string") {
      return {
        fieldTree: ctx.fieldTree,
        message: result
      };
    }
    return result ? {
      fieldTree: ctx.fieldTree
    } : void 0;
  });
}
function hidden(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addHiddenRule(logic);
}
function readonly(path, logic = () => true) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addReadonlyRule(logic);
}
function getLengthOrSize(value) {
  const v = value;
  return typeof v.length === "number" ? v.length : v.size;
}
function getOption(opt, ctx) {
  return opt instanceof Function ? opt(ctx) : opt;
}
function isEmpty(value) {
  if (typeof value === "number") {
    return isNaN(value);
  }
  return value === "" || value === false || value == null;
}
function validate(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addSyncErrorRule((ctx) => {
    return addDefaultField(logic(ctx), ctx.fieldTree);
  });
}
function requiredError(options) {
  return new RequiredValidationError(options);
}
function minError(min2, options) {
  return new MinValidationError(min2, options);
}
function maxError(max2, options) {
  return new MaxValidationError(max2, options);
}
function minLengthError(minLength2, options) {
  return new MinLengthValidationError(minLength2, options);
}
function maxLengthError(maxLength2, options) {
  return new MaxLengthValidationError(maxLength2, options);
}
function patternError(pattern2, options) {
  return new PatternValidationError(pattern2, options);
}
function emailError(options) {
  return new EmailValidationError(options);
}
function standardSchemaError(issue, options) {
  return new StandardSchemaValidationError(issue, options);
}
var _NgValidationError = class {
  __brand = void 0;
  kind = "";
  fieldTree;
  message;
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
};
var RequiredValidationError = class extends _NgValidationError {
  kind = "required";
};
var MinValidationError = class extends _NgValidationError {
  min;
  kind = "min";
  constructor(min2, options) {
    super(options);
    this.min = min2;
  }
};
var MaxValidationError = class extends _NgValidationError {
  max;
  kind = "max";
  constructor(max2, options) {
    super(options);
    this.max = max2;
  }
};
var MinLengthValidationError = class extends _NgValidationError {
  minLength;
  kind = "minLength";
  constructor(minLength2, options) {
    super(options);
    this.minLength = minLength2;
  }
};
var MaxLengthValidationError = class extends _NgValidationError {
  maxLength;
  kind = "maxLength";
  constructor(maxLength2, options) {
    super(options);
    this.maxLength = maxLength2;
  }
};
var PatternValidationError = class extends _NgValidationError {
  pattern;
  kind = "pattern";
  constructor(pattern2, options) {
    super(options);
    this.pattern = pattern2;
  }
};
var EmailValidationError = class extends _NgValidationError {
  kind = "email";
};
var StandardSchemaValidationError = class extends _NgValidationError {
  issue;
  kind = "standardSchema";
  constructor(issue, options) {
    super(options);
    this.issue = issue;
  }
};
var NgValidationError = _NgValidationError;
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
function email(path, config) {
  validate(path, (ctx) => {
    if (isEmpty(ctx.value())) {
      return void 0;
    }
    if (!EMAIL_REGEXP.test(ctx.value())) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return emailError({
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function max(path, maxValue, config) {
  const MAX_MEMO = metadata(path, createMetadataKey(), (ctx) => typeof maxValue === "number" ? maxValue : maxValue(ctx));
  metadata(path, MAX, ({
    state
  }) => state.metadata(MAX_MEMO)());
  validate(path, (ctx) => {
    if (isEmpty(ctx.value())) {
      return void 0;
    }
    const max2 = ctx.state.metadata(MAX_MEMO)();
    if (max2 === void 0 || Number.isNaN(max2)) {
      return void 0;
    }
    const value = ctx.value();
    const numValue = !value && value !== 0 ? NaN : Number(value);
    if (numValue > max2) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return maxError(max2, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function maxLength(path, maxLength2, config) {
  const MAX_LENGTH_MEMO = metadata(path, createMetadataKey(), (ctx) => typeof maxLength2 === "number" ? maxLength2 : maxLength2(ctx));
  metadata(path, MAX_LENGTH, ({
    state
  }) => state.metadata(MAX_LENGTH_MEMO)());
  validate(path, (ctx) => {
    if (isEmpty(ctx.value())) {
      return void 0;
    }
    const maxLength3 = ctx.state.metadata(MAX_LENGTH_MEMO)();
    if (maxLength3 === void 0) {
      return void 0;
    }
    if (getLengthOrSize(ctx.value()) > maxLength3) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return maxLengthError(maxLength3, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function min(path, minValue, config) {
  const MIN_MEMO = metadata(path, createMetadataKey(), (ctx) => typeof minValue === "number" ? minValue : minValue(ctx));
  metadata(path, MIN, ({
    state
  }) => state.metadata(MIN_MEMO)());
  validate(path, (ctx) => {
    if (isEmpty(ctx.value())) {
      return void 0;
    }
    const min2 = ctx.state.metadata(MIN_MEMO)();
    if (min2 === void 0 || Number.isNaN(min2)) {
      return void 0;
    }
    const value = ctx.value();
    const numValue = !value && value !== 0 ? NaN : Number(value);
    if (numValue < min2) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return minError(min2, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function minLength(path, minLength2, config) {
  const MIN_LENGTH_MEMO = metadata(path, createMetadataKey(), (ctx) => typeof minLength2 === "number" ? minLength2 : minLength2(ctx));
  metadata(path, MIN_LENGTH, ({
    state
  }) => state.metadata(MIN_LENGTH_MEMO)());
  validate(path, (ctx) => {
    if (isEmpty(ctx.value())) {
      return void 0;
    }
    const minLength3 = ctx.state.metadata(MIN_LENGTH_MEMO)();
    if (minLength3 === void 0) {
      return void 0;
    }
    if (getLengthOrSize(ctx.value()) < minLength3) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return minLengthError(minLength3, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function pattern(path, pattern2, config) {
  const PATTERN_MEMO = metadata(path, createMetadataKey(), (ctx) => pattern2 instanceof RegExp ? pattern2 : pattern2(ctx));
  metadata(path, PATTERN, ({
    state
  }) => state.metadata(PATTERN_MEMO)());
  validate(path, (ctx) => {
    if (isEmpty(ctx.value())) {
      return void 0;
    }
    const pattern3 = ctx.state.metadata(PATTERN_MEMO)();
    if (pattern3 === void 0) {
      return void 0;
    }
    if (!pattern3.test(ctx.value())) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return patternError(pattern3, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function required(path, config) {
  const REQUIRED_MEMO = metadata(path, createMetadataKey(), (ctx) => config?.when ? config.when(ctx) : true);
  metadata(path, REQUIRED, ({
    state
  }) => state.metadata(REQUIRED_MEMO)());
  validate(path, (ctx) => {
    if (ctx.state.metadata(REQUIRED_MEMO)() && isEmpty(ctx.value())) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return requiredError({
          message: getOption(config?.message, ctx)
        });
      }
    }
    return void 0;
  });
}
function validateAsync(path, opts) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  const RESOURCE = createManagedMetadataKey(opts.factory);
  metadata(path, RESOURCE, (ctx) => {
    const node = ctx.stateOf(path);
    const validationState = node.validationState;
    if (validationState.shouldSkipValidation() || !validationState.syncValid()) {
      return void 0;
    }
    return opts.params(ctx);
  });
  pathNode.builder.addAsyncErrorRule((ctx) => {
    const res = ctx.state.metadata(RESOURCE);
    let errors;
    switch (res.status()) {
      case "idle":
        return void 0;
      case "loading":
      case "reloading":
        return "pending";
      case "resolved":
      case "local":
        if (!res.hasValue()) {
          return void 0;
        }
        errors = opts.onSuccess(res.value(), ctx);
        return addDefaultField(errors, ctx.fieldTree);
      case "error":
        errors = opts.onError(res.error(), ctx);
        return addDefaultField(errors, ctx.fieldTree);
    }
  });
}
function validateTree(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addSyncTreeErrorRule((ctx) => addDefaultField(logic(ctx), ctx.fieldTree));
}
function validateStandardSchema(path, schema2) {
  const VALIDATOR_MEMO = metadata(path, createMetadataKey(), ({
    value
  }) => {
    return schema2["~standard"].validate(value());
  });
  validateTree(path, ({
    state,
    fieldTreeOf
  }) => {
    const result = state.metadata(VALIDATOR_MEMO)();
    if (isPromise(result)) {
      return [];
    }
    return result?.issues?.map((issue) => standardIssueToFormTreeError(fieldTreeOf(path), issue)) ?? [];
  });
  validateAsync(path, {
    params: ({
      state
    }) => {
      const result = state.metadata(VALIDATOR_MEMO)();
      return isPromise(result) ? result : void 0;
    },
    factory: (params) => {
      return resource({
        params,
        loader: async ({
          params: params2
        }) => (await params2)?.issues ?? []
      });
    },
    onSuccess: (issues, {
      fieldTreeOf
    }) => {
      return issues.map((issue) => standardIssueToFormTreeError(fieldTreeOf(path), issue));
    },
    onError: () => {
    }
  });
}
function standardIssueToFormTreeError(fieldTree, issue) {
  let target = fieldTree;
  for (const pathPart of issue.path ?? []) {
    const pathKey = typeof pathPart === "object" ? pathPart.key : pathPart;
    target = target[pathKey];
  }
  return addDefaultField(standardSchemaError(issue, {
    message: issue.message
  }), target);
}
function validateHttp(path, opts) {
  validateAsync(path, {
    params: opts.request,
    factory: (request) => httpResource(request, opts.options),
    onSuccess: opts.onSuccess,
    onError: opts.onError
  });
}
function debounce(path, durationOrDebouncer) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  const debouncer = typeof durationOrDebouncer === "function" ? durationOrDebouncer : durationOrDebouncer > 0 ? debounceForDuration(durationOrDebouncer) : immediate;
  pathNode.builder.addMetadataRule(DEBOUNCER, () => debouncer);
}
function debounceForDuration(durationInMilliseconds) {
  return (_context, abortSignal) => {
    return new Promise((resolve) => {
      let timeoutId;
      const onAbort = () => {
        clearTimeout(timeoutId);
      };
      timeoutId = setTimeout(() => {
        abortSignal.removeEventListener("abort", onAbort);
        resolve();
      }, durationInMilliseconds);
      abortSignal.addEventListener("abort", onAbort, {
        once: true
      });
    });
  };
}
function immediate() {
}
export {
  EmailValidationError,
  FIELD,
  FORM_FIELD,
  Field,
  FormField,
  MAX,
  MAX_LENGTH,
  MIN,
  MIN_LENGTH,
  MaxLengthValidationError,
  MaxValidationError,
  MetadataKey,
  MetadataReducer,
  MinLengthValidationError,
  MinValidationError,
  NgValidationError,
  PATTERN,
  PatternValidationError,
  REQUIRED,
  RequiredValidationError,
  StandardSchemaValidationError,
  apply,
  applyEach,
  applyWhen,
  applyWhenValue,
  createManagedMetadataKey,
  createMetadataKey,
  debounce,
  disabled,
  email,
  emailError,
  form,
  hidden,
  max,
  maxError,
  maxLength,
  maxLengthError,
  metadata,
  min,
  minError,
  minLength,
  minLengthError,
  pattern,
  patternError,
  provideSignalFormsConfig,
  readonly,
  required,
  requiredError,
  schema,
  standardSchemaError,
  submit,
  validate,
  validateAsync,
  validateHttp,
  validateStandardSchema,
  validateTree
};
//# sourceMappingURL=@angular_forms_signals.js.map
