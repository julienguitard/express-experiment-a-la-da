#!/usr/bin/env node
import __module from 'module';import __path from 'path';import __url from 'url';const require = __module.createRequire(import.meta.url);const __dirname = __path.dirname(__url.fileURLToPath(import.meta.url));const __filename=new URL(import.meta.url).pathname

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};
var compose = function(dict) {
  return dict.compose;
};
var composeFlipped = function(dictSemigroupoid) {
  var compose1 = compose(dictSemigroupoid);
  return function(f) {
    return function(g) {
      return compose1(g)(f);
    };
  };
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Function/index.js
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};
var applyFlipped = function(x) {
  return function(f) {
    return f(x);
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Data.Unit/foreign.js
var unit = void 0;

// output/Type.Proxy/index.js
var $$Proxy = /* @__PURE__ */ function() {
  function $$Proxy2() {
  }
  ;
  $$Proxy2.value = new $$Proxy2();
  return $$Proxy2;
}();

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var functorFn = {
  map: /* @__PURE__ */ compose(semigroupoidFn)
};
var functorArray = {
  map: arrayMap
};

// output/Control.Apply/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var apply = function(dict) {
  return dict.apply;
};
var applyFirst = function(dictApply) {
  var apply1 = apply(dictApply);
  var map11 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map11($$const)(a))(b);
    };
  };
};
var applySecond = function(dictApply) {
  var apply1 = apply(dictApply);
  var map11 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map11($$const(identity2))(a))(b);
    };
  };
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var liftA1 = function(dictApplicative) {
  var apply4 = apply(dictApplicative.Apply0());
  var pure12 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply4(pure12(f))(a);
    };
  };
};

// output/Control.Bind/index.js
var discard = function(dict) {
  return dict.discard;
};
var bind = function(dict) {
  return dict.bind;
};
var bindFlipped = function(dictBind) {
  return flip(bind(dictBind));
};
var composeKleisli = function(dictBind) {
  var bind1 = bind(dictBind);
  return function(f) {
    return function(g) {
      return function(a) {
        return bind1(f(a))(g);
      };
    };
  };
};
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind4 = bind(dictMonad.Bind1());
  var pure6 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind4(f)(function(f$prime) {
        return bind4(a)(function(a$prime) {
          return pure6(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.Bounded/foreign.js
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq3) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq3 : gt;
        };
      };
    };
  };
};
var ordStringImpl = unsafeCompareImpl;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqBooleanImpl = refEq;
var eqStringImpl = refEq;

// output/Data.Symbol/index.js
var reflectSymbol = function(dict) {
  return dict.reflectSymbol;
};

// output/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};

// output/Data.Eq/index.js
var eqString = {
  eq: eqStringImpl
};
var eqBoolean = {
  eq: eqBooleanImpl
};
var eq = function(dict) {
  return dict.eq;
};
var eq2 = /* @__PURE__ */ eq(eqBoolean);
var notEq = function(dictEq) {
  var eq3 = eq(dictEq);
  return function(x) {
    return function(y) {
      return eq2(eq3(x)(y))(false);
    };
  };
};

// output/Data.Ordering/index.js
var LT = /* @__PURE__ */ function() {
  function LT2() {
  }
  ;
  LT2.value = new LT2();
  return LT2;
}();
var GT = /* @__PURE__ */ function() {
  function GT2() {
  }
  ;
  GT2.value = new GT2();
  return GT2;
}();
var EQ = /* @__PURE__ */ function() {
  function EQ2() {
  }
  ;
  EQ2.value = new EQ2();
  return EQ2;
}();

// output/Data.Ord/index.js
var ordString = /* @__PURE__ */ function() {
  return {
    compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqString;
    }
  };
}();
var compare = function(dict) {
  return dict.compare;
};

// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};

// output/Data.Show/index.js
var showInt = {
  show: showIntImpl
};
var show = function(dict) {
  return dict.show;
};

// output/Data.Generic.Rep/index.js
var Constructor = function(x) {
  return x;
};
var Argument = function(x) {
  return x;
};
var to = function(dict) {
  return dict.to;
};
var from = function(dict) {
  return dict.from;
};

// output/Data.Semigroup/index.js
var append = function(dict) {
  return dict.append;
};

// output/Data.Monoid/index.js
var mempty = function(dict) {
  return dict.mempty;
};

// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();
var snd = function(v) {
  return v.value1;
};
var fst = function(v) {
  return v.value0;
};

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name2, moduleName, init4) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init4();
    state2 = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);

// output/Effect.Class/index.js
var monadEffectEffect = {
  liftEffect: /* @__PURE__ */ identity(categoryFn),
  Monad0: function() {
    return monadEffect;
  }
};
var liftEffect = function(dict) {
  return dict.liftEffect;
};

// output/Control.Monad.Cont.Trans/index.js
var runContT = function(v) {
  return function(k) {
    return v(k);
  };
};

// output/Data.Maybe/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
var functorMaybe = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Just) {
        return new Just(v(v1.value0));
      }
      ;
      return Nothing.value;
    };
  }
};
var map2 = /* @__PURE__ */ map(functorMaybe);
var fromMaybe = function(a) {
  return maybe(a)(identity3);
};
var fromJust = function() {
  return function(v) {
    if (v instanceof Just) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
  };
};
var applyMaybe = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return map2(v.value0)(v1);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};

// output/Data.Either/index.js
var Left = /* @__PURE__ */ function() {
  function Left2(value0) {
    this.value0 = value0;
  }
  ;
  Left2.create = function(value0) {
    return new Left2(value0);
  };
  return Left2;
}();
var Right = /* @__PURE__ */ function() {
  function Right2(value0) {
    this.value0 = value0;
  }
  ;
  Right2.create = function(value0) {
    return new Right2(value0);
  };
  return Right2;
}();
var functorEither = {
  map: function(f) {
    return function(m) {
      if (m instanceof Left) {
        return new Left(m.value0);
      }
      ;
      if (m instanceof Right) {
        return new Right(f(m.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
    };
  }
};
var map3 = /* @__PURE__ */ map(functorEither);
var either = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Left) {
        return v(v2.value0);
      }
      ;
      if (v2 instanceof Right) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var applyEither = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Left) {
        return new Left(v.value0);
      }
      ;
      if (v instanceof Right) {
        return map3(v.value0)(v1);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorEither;
  }
};
var bindEither = {
  bind: /* @__PURE__ */ either(function(e) {
    return function(v) {
      return new Left(e);
    };
  })(function(a) {
    return function(f) {
      return f(a);
    };
  }),
  Apply0: function() {
    return applyEither;
  }
};
var applicativeEither = /* @__PURE__ */ function() {
  return {
    pure: Right.create,
    Apply0: function() {
      return applyEither;
    }
  };
}();

// output/Effect.Exception/foreign.js
function message(e) {
  return e.message;
}

// output/Control.Monad.Error.Class/index.js
var catchError = function(dict) {
  return dict.catchError;
};
var $$try = function(dictMonadError) {
  var catchError1 = catchError(dictMonadError);
  var Monad0 = dictMonadError.MonadThrow0().Monad0();
  var map11 = map(Monad0.Bind1().Apply0().Functor0());
  var pure6 = pure(Monad0.Applicative0());
  return function(a) {
    return catchError1(map11(Right.create)(a))(function($52) {
      return pure6(Left.create($52));
    });
  };
};

// output/Effect.Ref/foreign.js
var _new = function(val) {
  return function() {
    return { value: val };
  };
};

// output/Effect.Ref/index.js
var $$new = _new;

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init4) {
    return function(xs) {
      var acc = init4;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init4) {
    return function(xs) {
      var acc = init4;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Data.Bifunctor/index.js
var identity4 = /* @__PURE__ */ identity(categoryFn);
var bimap = function(dict) {
  return dict.bimap;
};
var rmap = function(dictBifunctor) {
  return bimap(dictBifunctor)(identity4);
};
var bifunctorTuple = {
  bimap: function(f) {
    return function(g) {
      return function(v) {
        return new Tuple(f(v.value0), g(v.value1));
      };
    };
  }
};
var bifunctorEither = {
  bimap: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return new Left(v(v2.value0));
        }
        ;
        if (v2 instanceof Right) {
          return new Right(v1(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  }
};

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
};

// output/Safe.Coerce/index.js
var coerce = function() {
  return unsafeCoerce2;
};

// output/Data.Newtype/index.js
var coerce2 = /* @__PURE__ */ coerce();
var unwrap = function() {
  return coerce2;
};
var unwrap1 = /* @__PURE__ */ unwrap();
var un = function() {
  return function(v) {
    return unwrap1;
  };
};

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var foldl = function(dict) {
  return dict.foldl;
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr22 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append4 = append(dictMonoid.Semigroup0());
    var mempty3 = mempty(dictMonoid);
    return function(f) {
      return foldr22(function(x) {
        return function(acc) {
          return append4(f(x))(acc);
        };
      })(mempty3);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = /* @__PURE__ */ function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat22(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply4) {
    return function(map11) {
      return function(pure6) {
        return function(f) {
          return function(array) {
            function go(bot, top2) {
              switch (top2 - bot) {
                case 0:
                  return pure6([]);
                case 1:
                  return map11(array1)(f(array[bot]));
                case 2:
                  return apply4(map11(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply4(apply4(map11(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                  return apply4(map11(concat22)(go(bot, pivot)))(go(pivot, top2));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Traversable/index.js
var identity5 = /* @__PURE__ */ identity(categoryFn);
var traverse = function(dict) {
  return dict.traverse;
};
var sequenceDefault = function(dictTraversable) {
  var traverse22 = traverse(dictTraversable);
  return function(dictApplicative) {
    return traverse22(dictApplicative)(identity5);
  };
};
var traversableArray = {
  traverse: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
  },
  sequence: function(dictApplicative) {
    return sequenceDefault(traversableArray)(dictApplicative);
  },
  Functor0: function() {
    return functorArray;
  },
  Foldable1: function() {
    return foldableArray;
  }
};

// output/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler2(error3) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error3) {
      setTimeout(function() {
        throw error3;
      }, 0);
    }
  }
  function runSync(left2, right2, eff) {
    try {
      return right2(eff());
    } catch (error3) {
      return left2(error3);
    }
  }
  function runAsync(left2, eff, k) {
    try {
      return eff(k)();
    } catch (error3) {
      k(left2(error3))();
      return nonCanceler2;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size4 = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size4 !== 0) {
        size4--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size4 === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size4) % limit] = cb;
        size4++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error3) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step = aff;
    var fail = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run5(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step = bhead(step);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail = util.left(e);
              step = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step)) {
              status = RETURN;
              fail = step;
              step = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step = util.fromRight(step);
            }
            break;
          case CONTINUE:
            switch (step.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step._2;
                status = CONTINUE;
                step = step._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step = util.right(step._1);
                } else {
                  status = STEP_BIND;
                  step = step._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step = runSync(util.left, util.right, step._1);
                break;
              case ASYNC:
                status = PENDING;
                step = runAsync(util.left, step._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step = result2;
                      run5(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail = util.left(step._1);
                step = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step = step._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step._1) {
                  tmp.run();
                }
                step = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step = sequential2(util, supervisor, step._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step = interrupt || fail || step;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail) {
                    status = CONTINUE;
                    step = attempt._2(util.fromLeft(fail));
                    fail = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step = util.fromRight(step);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail === null) {
                    result = util.fromRight(step);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail) {
                    step = attempt._1.failed(util.fromLeft(fail))(attempt._2);
                  } else {
                    step = attempt._1.completed(util.fromRight(step))(attempt._2);
                  }
                  fail = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step, fail), attempts, interrupt);
                  status = CONTINUE;
                  step = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step = attempt._1;
                  fail = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step));
              }
            }
            joins = null;
            if (interrupt && fail) {
              setTimeout(function() {
                throw util.fromLeft(fail);
              }, 0);
            } else if (util.isLeft(step) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join3) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join3.rethrow;
          join3.handler(step)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join3;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error3, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error3);
            status = COMPLETED;
            step = interrupt;
            run5(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error3);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step(error3)), attempts, interrupt);
              }
              status = RETURN;
              step = null;
              fail = null;
              run5(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error3);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step = null;
              fail = null;
            }
        }
        return canceler;
      };
    }
    function join2(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run5(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join: join2,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run5(runTick);
            });
          } else {
            run5(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root2 = EMPTY;
    function kill(error3, par2, cb2) {
      var step = par2;
      var head3 = null;
      var tail3 = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step.tag) {
            case FORKED:
              if (step._3 === EMPTY) {
                tmp = fibers[step._1];
                kills2[count++] = tmp.kill(error3, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head3 === null) {
                break loop;
              }
              step = head3._2;
              if (tail3 === null) {
                head3 = null;
              } else {
                head3 = tail3._1;
                tail3 = tail3._2;
              }
              break;
            case MAP:
              step = step._2;
              break;
            case APPLY:
            case ALT:
              if (head3) {
                tail3 = new Aff2(CONS, head3, tail3);
              }
              head3 = step;
              step = step._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join2(result, head3, tail3) {
      var fail, step, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail = result;
        step = null;
      } else {
        step = result;
        fail = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head3 === null) {
            cb(fail || step)();
            return;
          }
          if (head3._3 !== EMPTY) {
            return;
          }
          switch (head3.tag) {
            case MAP:
              if (fail === null) {
                head3._3 = util.right(head3._1(util.fromRight(step)));
                step = head3._3;
              } else {
                head3._3 = fail;
              }
              break;
            case APPLY:
              lhs = head3._1._3;
              rhs = head3._2._3;
              if (fail) {
                head3._3 = fail;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail === lhs ? head3._2 : head3._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail3 === null) {
                      join2(fail, null, null);
                    } else {
                      join2(fail, tail3._1, tail3._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head3._3 = step;
              }
              break;
            case ALT:
              lhs = head3._1._3;
              rhs = head3._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail = step === lhs ? rhs : lhs;
                step = null;
                head3._3 = fail;
              } else {
                head3._3 = step;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step === lhs ? head3._2 : head3._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail3 === null) {
                      join2(step, null, null);
                    } else {
                      join2(step, tail3._1, tail3._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail3 === null) {
            head3 = null;
          } else {
            head3 = tail3._1;
            tail3 = tail3._2;
          }
        }
    }
    function resolve(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join2(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run5() {
      var status = CONTINUE;
      var step = par;
      var head3 = null;
      var tail3 = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step.tag) {
                case MAP:
                  if (head3) {
                    tail3 = new Aff2(CONS, head3, tail3);
                  }
                  head3 = new Aff2(MAP, step._1, EMPTY, EMPTY);
                  step = step._2;
                  break;
                case APPLY:
                  if (head3) {
                    tail3 = new Aff2(CONS, head3, tail3);
                  }
                  head3 = new Aff2(APPLY, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                case ALT:
                  if (head3) {
                    tail3 = new Aff2(CONS, head3, tail3);
                  }
                  head3 = new Aff2(ALT, EMPTY, step._2, EMPTY);
                  step = step._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step;
                  step = new Aff2(FORKED, fid, new Aff2(CONS, head3, tail3), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head3 === null) {
                break loop;
              }
              if (head3._1 === EMPTY) {
                head3._1 = step;
                status = CONTINUE;
                step = head3._2;
                head3._2 = EMPTY;
              } else {
                head3._2 = step;
                step = head3;
                if (tail3 === null) {
                  head3 = null;
                } else {
                  head3 = tail3._1;
                  tail3 = tail3._2;
                }
              }
          }
        }
      root2 = step;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error3, cb2) {
      interrupt = util.left(error3);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error3, root2, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler2;
          };
        });
      };
    }
    run5();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential2(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler2;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _sequential = Aff.Seq;

// output/Control.Monad.ST.Internal/foreign.js
var map_ = function(f) {
  return function(a) {
    return function() {
      return f(a());
    };
  };
};
var foreach = function(as2) {
  return function(f) {
    return function() {
      for (var i = 0, l = as2.length; i < l; i++) {
        f(as2[i])();
      }
    };
  };
};

// output/Control.Monad.ST.Internal/index.js
var functorST = {
  map: map_
};

// output/Data.Profunctor/index.js
var identity6 = /* @__PURE__ */ identity(categoryFn);
var profunctorFn = {
  dimap: function(a2b) {
    return function(c2d) {
      return function(b2c) {
        return function($18) {
          return c2d(b2c(a2b($18)));
        };
      };
    };
  }
};
var dimap = function(dict) {
  return dict.dimap;
};
var lcmap = function(dictProfunctor) {
  var dimap1 = dimap(dictProfunctor);
  return function(a2b) {
    return dimap1(a2b)(identity6);
  };
};

// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f) {
  return f();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Effect.Aff/index.js
var $runtime_lazy2 = function(name2, moduleName, init4) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init4();
    state2 = 2;
    return val;
  };
};
var functorAff = {
  map: _map
};
var ffiUtil = /* @__PURE__ */ function() {
  var unsafeFromRight = function(v) {
    if (v instanceof Right) {
      return v.value0;
    }
    ;
    if (v instanceof Left) {
      return unsafeCrashWith("unsafeFromRight: Left");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
  };
  var unsafeFromLeft = function(v) {
    if (v instanceof Left) {
      return v.value0;
    }
    ;
    if (v instanceof Right) {
      return unsafeCrashWith("unsafeFromLeft: Right");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
  };
  var isLeft = function(v) {
    if (v instanceof Left) {
      return true;
    }
    ;
    if (v instanceof Right) {
      return false;
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
  };
  return {
    isLeft,
    fromLeft: unsafeFromLeft,
    fromRight: unsafeFromRight,
    left: Left.create,
    right: Right.create
  };
}();
var makeFiber = function(aff) {
  return _makeFiber(ffiUtil, aff);
};
var launchAff = function(aff) {
  return function __do() {
    var fiber = makeFiber(aff)();
    fiber.run();
    return fiber;
  };
};
var monadAff = {
  Applicative0: function() {
    return applicativeAff;
  },
  Bind1: function() {
    return bindAff;
  }
};
var bindAff = {
  bind: _bind,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var applicativeAff = {
  pure: _pure,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
  return {
    apply: ap(monadAff),
    Functor0: function() {
      return functorAff;
    }
  };
});
var pure2 = /* @__PURE__ */ pure(applicativeAff);
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindAff);
var monadEffectAff = {
  liftEffect: _liftEffect,
  Monad0: function() {
    return monadAff;
  }
};
var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
var monadThrowAff = {
  throwError: _throwError,
  Monad0: function() {
    return monadAff;
  }
};
var monadErrorAff = {
  catchError: _catchError,
  MonadThrow0: function() {
    return monadThrowAff;
  }
};
var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
var runAff = function(k) {
  return function(aff) {
    return launchAff(bindFlipped2(function($83) {
      return liftEffect2(k($83));
    })($$try2(aff)));
  };
};
var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure2(unit));

// output/Effect.Aff.Class/index.js
var monadAffAff = {
  liftAff: /* @__PURE__ */ identity(categoryFn),
  MonadEffect0: function() {
    return monadEffectAff;
  }
};
var liftAff = function(dict) {
  return dict.liftAff;
};

// output/Data.Array/foreign.js
var replicateFill = function(count, value) {
  if (count < 1) {
    return [];
  }
  var result = new Array(count);
  return result.fill(value);
};
var replicatePolyfill = function(count, value) {
  var result = [];
  var n = 0;
  for (var i = 0; i < count; i++) {
    result[n++] = value;
  }
  return result;
};
var replicateImpl = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = /* @__PURE__ */ function() {
  function Cons2(head3, tail3) {
    this.head = head3;
    this.tail = tail3;
  }
  var emptyList = {};
  function curryCons(head3) {
    return function(tail3) {
      return new Cons2(head3, tail3);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr3, xs) {
    return listToArray(foldr3(curryCons)(emptyList)(xs));
  };
}();
var length = function(xs) {
  return xs.length;
};
var unconsImpl = function(empty5, next, xs) {
  return xs.length === 0 ? empty5({}) : next(xs[0])(xs.slice(1));
};
var indexImpl = function(just, nothing, xs, i) {
  return i < 0 || i >= xs.length ? nothing : just(xs[i]);
};
var filterImpl = function(f, xs) {
  return xs.filter(f);
};
var sliceImpl = function(s, e, l) {
  return l.slice(s, e);
};

// output/Data.Array.ST/foreign.js
function unsafeFreezeThawImpl(xs) {
  return xs;
}
var unsafeFreezeImpl = unsafeFreezeThawImpl;
function copyImpl(xs) {
  return xs.slice();
}
var thawImpl = copyImpl;
var pushImpl = function(a, xs) {
  return xs.push(a);
};

// output/Control.Monad.ST.Uncurried/foreign.js
var runSTFn1 = function runSTFn12(fn) {
  return function(a) {
    return function() {
      return fn(a);
    };
  };
};
var runSTFn2 = function runSTFn22(fn) {
  return function(a) {
    return function(b) {
      return function() {
        return fn(a, b);
      };
    };
  };
};

// output/Data.Array.ST/index.js
var unsafeFreeze = /* @__PURE__ */ runSTFn1(unsafeFreezeImpl);
var thaw = /* @__PURE__ */ runSTFn1(thawImpl);
var withArray = function(f) {
  return function(xs) {
    return function __do() {
      var result = thaw(xs)();
      f(result)();
      return unsafeFreeze(result)();
    };
  };
};
var push = /* @__PURE__ */ runSTFn2(pushImpl);

// output/Data.Function.Uncurried/foreign.js
var runFn2 = function(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
};
var runFn3 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
};
var runFn4 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

// output/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing2) {
  return function(fromJust4) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var maybe2 = f(value);
              if (isNothing2(maybe2))
                return result;
              var tuple = fromJust4(maybe2);
              result.push(fst2(tuple));
              value = snd2(tuple);
            }
          };
        };
      };
    };
  };
};

// output/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing2) {
  return function(fromJust4) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var tuple = f(value);
              result.push(fst2(tuple));
              var maybe2 = snd2(tuple);
              if (isNothing2(maybe2))
                return result;
              value = fromJust4(maybe2);
            }
          };
        };
      };
    };
  };
};

// output/Data.Unfoldable1/index.js
var fromJust2 = /* @__PURE__ */ fromJust();
var unfoldable1Array = {
  unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
};

// output/Data.Unfoldable/index.js
var fromJust3 = /* @__PURE__ */ fromJust();
var unfoldr = function(dict) {
  return dict.unfoldr;
};
var unfoldableArray = {
  unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
  Unfoldable10: function() {
    return unfoldable1Array;
  }
};

// output/Data.Array/index.js
var uncons = /* @__PURE__ */ function() {
  return runFn3(unconsImpl)($$const(Nothing.value))(function(x) {
    return function(xs) {
      return new Just({
        head: x,
        tail: xs
      });
    };
  });
}();
var tail = /* @__PURE__ */ function() {
  return runFn3(unconsImpl)($$const(Nothing.value))(function(v) {
    return function(xs) {
      return new Just(xs);
    };
  });
}();
var snoc = function(xs) {
  return function(x) {
    return withArray(push(x))(xs)();
  };
};
var slice = /* @__PURE__ */ runFn3(sliceImpl);
var singleton2 = function(a) {
  return [a];
};
var index = /* @__PURE__ */ function() {
  return runFn4(indexImpl)(Just.create)(Nothing.value);
}();
var head = function(xs) {
  return index(xs)(0);
};
var fromFoldable = function(dictFoldable) {
  return runFn2(fromFoldableImpl)(foldr(dictFoldable));
};
var filter = /* @__PURE__ */ runFn2(filterImpl);
var drop = function(n) {
  return function(xs) {
    var $173 = n < 1;
    if ($173) {
      return xs;
    }
    ;
    return slice(n)(length(xs))(xs);
  };
};

// output/Data.TraversableWithIndex/index.js
var traverseWithIndex = function(dict) {
  return dict.traverseWithIndex;
};

// output/Data.List.Types/index.js
var Nil = /* @__PURE__ */ function() {
  function Nil2() {
  }
  ;
  Nil2.value = new Nil2();
  return Nil2;
}();
var Cons = /* @__PURE__ */ function() {
  function Cons2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Cons2.create = function(value0) {
    return function(value1) {
      return new Cons2(value0, value1);
    };
  };
  return Cons2;
}();
var foldableList = {
  foldr: function(f) {
    return function(b) {
      var rev = function() {
        var go = function($copy_v) {
          return function($copy_v1) {
            var $tco_var_v = $copy_v;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v, v1) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return v;
              }
              ;
              if (v1 instanceof Cons) {
                $tco_var_v = new Cons(v1.value0, v);
                $copy_v1 = v1.value1;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v, $copy_v1);
            }
            ;
            return $tco_result;
          };
        };
        return go(Nil.value);
      }();
      var $284 = foldl(foldableList)(flip(f))(b);
      return function($285) {
        return $284(rev($285));
      };
    };
  },
  foldl: function(f) {
    var go = function($copy_b) {
      return function($copy_v) {
        var $tco_var_b = $copy_b;
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(b, v) {
          if (v instanceof Nil) {
            $tco_done1 = true;
            return b;
          }
          ;
          if (v instanceof Cons) {
            $tco_var_b = f(b)(v.value0);
            $copy_v = v.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done1) {
          $tco_result = $tco_loop($tco_var_b, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return go;
  },
  foldMap: function(dictMonoid) {
    var append22 = append(dictMonoid.Semigroup0());
    var mempty3 = mempty(dictMonoid);
    return function(f) {
      return foldl(foldableList)(function(acc) {
        var $286 = append22(acc);
        return function($287) {
          return $286(f($287));
        };
      })(mempty3);
    };
  }
};
var foldr2 = /* @__PURE__ */ foldr(foldableList);
var semigroupList = {
  append: function(xs) {
    return function(ys) {
      return foldr2(Cons.create)(ys)(xs);
    };
  }
};
var monoidList = /* @__PURE__ */ function() {
  return {
    mempty: Nil.value,
    Semigroup0: function() {
      return semigroupList;
    }
  };
}();

// output/Data.Map.Internal/index.js
var $runtime_lazy3 = function(name2, moduleName, init4) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init4();
    state2 = 2;
    return val;
  };
};
var identity7 = /* @__PURE__ */ identity(categoryFn);
var Leaf = /* @__PURE__ */ function() {
  function Leaf2() {
  }
  ;
  Leaf2.value = new Leaf2();
  return Leaf2;
}();
var Node = /* @__PURE__ */ function() {
  function Node2(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  Node2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new Node2(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return Node2;
}();
var Split = /* @__PURE__ */ function() {
  function Split2(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  Split2.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new Split2(value0, value1, value2);
      };
    };
  };
  return Split2;
}();
var unsafeNode = function(k, v, l, r) {
  if (l instanceof Leaf) {
    if (r instanceof Leaf) {
      return new Node(1, 1, k, v, l, r);
    }
    ;
    if (r instanceof Node) {
      return new Node(1 + r.value0 | 0, 1 + r.value1 | 0, k, v, l, r);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 680, column 5 - line 684, column 39): " + [r.constructor.name]);
  }
  ;
  if (l instanceof Node) {
    if (r instanceof Leaf) {
      return new Node(1 + l.value0 | 0, 1 + l.value1 | 0, k, v, l, r);
    }
    ;
    if (r instanceof Node) {
      return new Node(1 + function() {
        var $277 = l.value0 > r.value0;
        if ($277) {
          return l.value0;
        }
        ;
        return r.value0;
      }() | 0, (1 + l.value1 | 0) + r.value1 | 0, k, v, l, r);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 686, column 5 - line 690, column 68): " + [r.constructor.name]);
  }
  ;
  throw new Error("Failed pattern match at Data.Map.Internal (line 678, column 32 - line 690, column 68): " + [l.constructor.name]);
};
var singleton4 = function(k) {
  return function(v) {
    return new Node(1, 1, k, v, Leaf.value, Leaf.value);
  };
};
var unsafeBalancedNode = /* @__PURE__ */ function() {
  var height = function(v) {
    if (v instanceof Leaf) {
      return 0;
    }
    ;
    if (v instanceof Node) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 735, column 12 - line 737, column 26): " + [v.constructor.name]);
  };
  var rotateLeft = function(k, v, l, rk, rv, rl, rr) {
    if (rl instanceof Node && rl.value0 > height(rr)) {
      return unsafeNode(rl.value2, rl.value3, unsafeNode(k, v, l, rl.value4), unsafeNode(rk, rv, rl.value5, rr));
    }
    ;
    return unsafeNode(rk, rv, unsafeNode(k, v, l, rl), rr);
  };
  var rotateRight = function(k, v, lk, lv, ll, lr, r) {
    if (lr instanceof Node && height(ll) <= lr.value0) {
      return unsafeNode(lr.value2, lr.value3, unsafeNode(lk, lv, ll, lr.value4), unsafeNode(k, v, lr.value5, r));
    }
    ;
    return unsafeNode(lk, lv, ll, unsafeNode(k, v, lr, r));
  };
  return function(k, v, l, r) {
    if (l instanceof Leaf) {
      if (r instanceof Leaf) {
        return singleton4(k)(v);
      }
      ;
      if (r instanceof Node && r.value0 > 1) {
        return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
      }
      ;
      return unsafeNode(k, v, l, r);
    }
    ;
    if (l instanceof Node) {
      if (r instanceof Node) {
        if (r.value0 > (l.value0 + 1 | 0)) {
          return rotateLeft(k, v, l, r.value2, r.value3, r.value4, r.value5);
        }
        ;
        if (l.value0 > (r.value0 + 1 | 0)) {
          return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
        }
        ;
      }
      ;
      if (r instanceof Leaf && l.value0 > 1) {
        return rotateRight(k, v, l.value2, l.value3, l.value4, l.value5, r);
      }
      ;
      return unsafeNode(k, v, l, r);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 695, column 40 - line 716, column 34): " + [l.constructor.name]);
  };
}();
var $lazy_unsafeSplit = /* @__PURE__ */ $runtime_lazy3("unsafeSplit", "Data.Map.Internal", function() {
  return function(comp, k, m) {
    if (m instanceof Leaf) {
      return new Split(Nothing.value, Leaf.value, Leaf.value);
    }
    ;
    if (m instanceof Node) {
      var v = comp(k)(m.value2);
      if (v instanceof LT) {
        var v1 = $lazy_unsafeSplit(771)(comp, k, m.value4);
        return new Split(v1.value0, v1.value1, unsafeBalancedNode(m.value2, m.value3, v1.value2, m.value5));
      }
      ;
      if (v instanceof GT) {
        var v1 = $lazy_unsafeSplit(774)(comp, k, m.value5);
        return new Split(v1.value0, unsafeBalancedNode(m.value2, m.value3, m.value4, v1.value1), v1.value2);
      }
      ;
      if (v instanceof EQ) {
        return new Split(new Just(m.value3), m.value4, m.value5);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 769, column 5 - line 777, column 30): " + [v.constructor.name]);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 765, column 34 - line 777, column 30): " + [m.constructor.name]);
  };
});
var unsafeSplit = /* @__PURE__ */ $lazy_unsafeSplit(764);
var $lazy_unsafeUnionWith = /* @__PURE__ */ $runtime_lazy3("unsafeUnionWith", "Data.Map.Internal", function() {
  return function(comp, app, l, r) {
    if (l instanceof Leaf) {
      return r;
    }
    ;
    if (r instanceof Leaf) {
      return l;
    }
    ;
    if (r instanceof Node) {
      var v = unsafeSplit(comp, r.value2, l);
      var l$prime = $lazy_unsafeUnionWith(787)(comp, app, v.value1, r.value4);
      var r$prime = $lazy_unsafeUnionWith(788)(comp, app, v.value2, r.value5);
      if (v.value0 instanceof Just) {
        return unsafeBalancedNode(r.value2, app(v.value0.value0)(r.value3), l$prime, r$prime);
      }
      ;
      if (v.value0 instanceof Nothing) {
        return unsafeBalancedNode(r.value2, r.value3, l$prime, r$prime);
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 789, column 5 - line 793, column 46): " + [v.value0.constructor.name]);
    }
    ;
    throw new Error("Failed pattern match at Data.Map.Internal (line 782, column 42 - line 793, column 46): " + [l.constructor.name, r.constructor.name]);
  };
});
var unsafeUnionWith = /* @__PURE__ */ $lazy_unsafeUnionWith(781);
var unionWith = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(app) {
    return function(m1) {
      return function(m2) {
        return unsafeUnionWith(compare3, app, m1, m2);
      };
    };
  };
};
var union = function(dictOrd) {
  return unionWith(dictOrd)($$const);
};
var insert = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(k) {
    return function(v) {
      var go = function(v1) {
        if (v1 instanceof Leaf) {
          return singleton4(k)(v);
        }
        ;
        if (v1 instanceof Node) {
          var v2 = compare3(k)(v1.value2);
          if (v2 instanceof LT) {
            return unsafeBalancedNode(v1.value2, v1.value3, go(v1.value4), v1.value5);
          }
          ;
          if (v2 instanceof GT) {
            return unsafeBalancedNode(v1.value2, v1.value3, v1.value4, go(v1.value5));
          }
          ;
          if (v2 instanceof EQ) {
            return new Node(v1.value0, v1.value1, k, v, v1.value4, v1.value5);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 469, column 7 - line 472, column 35): " + [v2.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 466, column 8 - line 472, column 35): " + [v1.constructor.name]);
      };
      return go;
    };
  };
};
var functorMap = {
  map: function(f) {
    var go = function(v) {
      if (v instanceof Leaf) {
        return Leaf.value;
      }
      ;
      if (v instanceof Node) {
        return new Node(v.value0, v.value1, v.value2, f(v.value3), go(v.value4), go(v.value5));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 145, column 10 - line 148, column 39): " + [v.constructor.name]);
    };
    return go;
  }
};
var functorWithIndexMap = {
  mapWithIndex: function(f) {
    var go = function(v) {
      if (v instanceof Leaf) {
        return Leaf.value;
      }
      ;
      if (v instanceof Node) {
        return new Node(v.value0, v.value1, v.value2, f(v.value2)(v.value3), go(v.value4), go(v.value5));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 153, column 10 - line 156, column 41): " + [v.constructor.name]);
    };
    return go;
  },
  Functor0: function() {
    return functorMap;
  }
};
var foldableMap = {
  foldr: function(f) {
    return function(z) {
      var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
        return function(m$prime, z$prime) {
          if (m$prime instanceof Leaf) {
            return z$prime;
          }
          ;
          if (m$prime instanceof Node) {
            return $lazy_go(170)(m$prime.value4, f(m$prime.value3)($lazy_go(170)(m$prime.value5, z$prime)));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 167, column 26 - line 170, column 43): " + [m$prime.constructor.name]);
        };
      });
      var go = $lazy_go(167);
      return function(m) {
        return go(m, z);
      };
    };
  },
  foldl: function(f) {
    return function(z) {
      var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
        return function(z$prime, m$prime) {
          if (m$prime instanceof Leaf) {
            return z$prime;
          }
          ;
          if (m$prime instanceof Node) {
            return $lazy_go(176)(f($lazy_go(176)(z$prime, m$prime.value4))(m$prime.value3), m$prime.value5);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 173, column 26 - line 176, column 43): " + [m$prime.constructor.name]);
        };
      });
      var go = $lazy_go(173);
      return function(m) {
        return go(z, m);
      };
    };
  },
  foldMap: function(dictMonoid) {
    var mempty3 = mempty(dictMonoid);
    var append1 = append(dictMonoid.Semigroup0());
    return function(f) {
      var go = function(v) {
        if (v instanceof Leaf) {
          return mempty3;
        }
        ;
        if (v instanceof Node) {
          return append1(go(v.value4))(append1(f(v.value3))(go(v.value5)));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 179, column 10 - line 182, column 28): " + [v.constructor.name]);
      };
      return go;
    };
  }
};
var foldableWithIndexMap = {
  foldrWithIndex: function(f) {
    return function(z) {
      var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
        return function(m$prime, z$prime) {
          if (m$prime instanceof Leaf) {
            return z$prime;
          }
          ;
          if (m$prime instanceof Node) {
            return $lazy_go(190)(m$prime.value4, f(m$prime.value2)(m$prime.value3)($lazy_go(190)(m$prime.value5, z$prime)));
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 187, column 26 - line 190, column 45): " + [m$prime.constructor.name]);
        };
      });
      var go = $lazy_go(187);
      return function(m) {
        return go(m, z);
      };
    };
  },
  foldlWithIndex: function(f) {
    return function(z) {
      var $lazy_go = $runtime_lazy3("go", "Data.Map.Internal", function() {
        return function(z$prime, m$prime) {
          if (m$prime instanceof Leaf) {
            return z$prime;
          }
          ;
          if (m$prime instanceof Node) {
            return $lazy_go(196)(f(m$prime.value2)($lazy_go(196)(z$prime, m$prime.value4))(m$prime.value3), m$prime.value5);
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 193, column 26 - line 196, column 45): " + [m$prime.constructor.name]);
        };
      });
      var go = $lazy_go(193);
      return function(m) {
        return go(z, m);
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    var mempty3 = mempty(dictMonoid);
    var append1 = append(dictMonoid.Semigroup0());
    return function(f) {
      var go = function(v) {
        if (v instanceof Leaf) {
          return mempty3;
        }
        ;
        if (v instanceof Node) {
          return append1(go(v.value4))(append1(f(v.value2)(v.value3))(go(v.value5)));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 199, column 10 - line 202, column 30): " + [v.constructor.name]);
      };
      return go;
    };
  },
  Foldable0: function() {
    return foldableMap;
  }
};
var traversableMap = {
  traverse: function(dictApplicative) {
    var pure6 = pure(dictApplicative);
    var Apply0 = dictApplicative.Apply0();
    var apply4 = apply(Apply0);
    var map13 = map(Apply0.Functor0());
    return function(f) {
      var go = function(v) {
        if (v instanceof Leaf) {
          return pure6(Leaf.value);
        }
        ;
        if (v instanceof Node) {
          return apply4(apply4(map13(function(l$prime) {
            return function(v$prime) {
              return function(r$prime) {
                return new Node(v.value0, v.value1, v.value2, v$prime, l$prime, r$prime);
              };
            };
          })(go(v.value4)))(f(v.value3)))(go(v.value5));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 207, column 10 - line 213, column 19): " + [v.constructor.name]);
      };
      return go;
    };
  },
  sequence: function(dictApplicative) {
    return traverse(traversableMap)(dictApplicative)(identity7);
  },
  Functor0: function() {
    return functorMap;
  },
  Foldable1: function() {
    return foldableMap;
  }
};
var traversableWithIndexMap = {
  traverseWithIndex: function(dictApplicative) {
    var pure6 = pure(dictApplicative);
    var Apply0 = dictApplicative.Apply0();
    var apply4 = apply(Apply0);
    var map13 = map(Apply0.Functor0());
    return function(f) {
      var go = function(v) {
        if (v instanceof Leaf) {
          return pure6(Leaf.value);
        }
        ;
        if (v instanceof Node) {
          return apply4(apply4(map13(function(l$prime) {
            return function(v$prime) {
              return function(r$prime) {
                return new Node(v.value0, v.value1, v.value2, v$prime, l$prime, r$prime);
              };
            };
          })(go(v.value4)))(f(v.value2)(v.value3)))(go(v.value5));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 219, column 10 - line 225, column 19): " + [v.constructor.name]);
      };
      return go;
    };
  },
  FunctorWithIndex0: function() {
    return functorWithIndexMap;
  },
  FoldableWithIndex1: function() {
    return foldableWithIndexMap;
  },
  Traversable2: function() {
    return traversableMap;
  }
};
var empty2 = /* @__PURE__ */ function() {
  return Leaf.value;
}();

// output/Data.String.Common/foreign.js
var replaceAll = function(s1) {
  return function(s2) {
    return function(s3) {
      return s3.replace(new RegExp(s1.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"), s2);
    };
  };
};
var split = function(sep) {
  return function(s) {
    return s.split(sep);
  };
};
var toLower = function(s) {
  return s.toLowerCase();
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output/Data.String.CaseInsensitive/index.js
var compare2 = /* @__PURE__ */ compare(ordString);
var eqCaseInsensitiveString = {
  eq: function(v) {
    return function(v1) {
      return toLower(v) === toLower(v1);
    };
  }
};
var ordCaseInsensitiveString = {
  compare: function(v) {
    return function(v1) {
      return compare2(toLower(v))(toLower(v1));
    };
  },
  Eq0: function() {
    return eqCaseInsensitiveString;
  }
};

// output/Foreign.Object/foreign.js
function _copyST(m) {
  return function() {
    var r = {};
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r[k] = m[k];
      }
    }
    return r;
  };
}
function runST(f) {
  return f();
}
function _foldM(bind4) {
  return function(f) {
    return function(mz) {
      return function(m) {
        var acc = mz;
        function g(k2) {
          return function(z) {
            return f(z)(k2)(m[k2]);
          };
        }
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            acc = bind4(acc)(g(k));
          }
        }
        return acc;
      };
    };
  };
}
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output/Foreign.Object.ST/foreign.js
var newImpl = function() {
  return {};
};
function poke2(k) {
  return function(v) {
    return function(m) {
      return function() {
        m[k] = v;
        return m;
      };
    };
  };
}
var deleteImpl = function(k) {
  return function(m) {
    return function() {
      delete m[k];
      return m;
    };
  };
};

// output/Foreign.Object/index.js
var $$void2 = /* @__PURE__ */ $$void(functorST);
var thawST = _copyST;
var mutate = function(f) {
  return function(m) {
    return runST(function __do() {
      var s = thawST(m)();
      f(s)();
      return s;
    });
  };
};
var fromFoldable2 = function(dictFoldable) {
  var fromFoldable1 = fromFoldable(dictFoldable);
  return function(l) {
    return runST(function __do() {
      var s = newImpl();
      foreach(fromFoldable1(l))(function(v) {
        return $$void2(poke2(v.value0)(v.value1)(s));
      })();
      return s;
    });
  };
};
var fold2 = /* @__PURE__ */ _foldM(applyFlipped);
var $$delete = function(k) {
  return mutate(deleteImpl(k));
};

// output/Node.HTTP.IncomingMessage/foreign.js
var headersImpl = (im) => im.headers;
var httpVersion = (im) => im.httpVersion;
var method = (im) => im.method;
var url = (im) => im.url;

// output/Data.Nullable/foreign.js
function nullable(a, r, f) {
  return a == null ? r : f(a);
}

// output/Data.Nullable/index.js
var toMaybe = function(n) {
  return nullable(n, Nothing.value, Just.create);
};

// output/Node.EventEmitter/foreign.js
var unsafeOn = (emitter, eventName, cb) => emitter.on(eventName, cb);

// output/Node.EventEmitter/index.js
var EventHandle = /* @__PURE__ */ function() {
  function EventHandle2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  EventHandle2.create = function(value0) {
    return function(value1) {
      return new EventHandle2(value0, value1);
    };
  };
  return EventHandle2;
}();
var on_ = function(v) {
  return function(psCb) {
    return function(eventEmitter) {
      return function() {
        return unsafeOn(eventEmitter, v.value0, v.value1(psCb));
      };
    };
  };
};

// output/Node.HTTP.IncomingMessage/index.js
var toReadable = unsafeCoerce2;
var headers = /* @__PURE__ */ function() {
  var $3 = $$delete("set-cookie");
  return function($4) {
    return $3(headersImpl($4));
  };
}();

// output/Node.HTTP.OutgoingMessage/foreign.js
var setHeaderArrImpl = (name2, value, om) => om.setHeader(name2, value);

// output/Node.HTTP.OutgoingMessage/index.js
var toWriteable = unsafeCoerce2;
var setHeader$prime = function(name2) {
  return function(value) {
    return function(msg) {
      return function() {
        return setHeaderArrImpl(name2, value, msg);
      };
    };
  };
};

// output/Node.HTTP.ServerResponse/foreign.js
var setStatusCodeImpl = (code, sr) => {
  sr.statusCode = code;
};

// output/Node.HTTP.ServerResponse/index.js
var toOutgoingMessage = unsafeCoerce2;
var setStatusCode = function(code) {
  return function(sr) {
    return function() {
      return setStatusCodeImpl(code, sr);
    };
  };
};

// output/Record.Unsafe.Union/foreign.js
function unsafeUnionFn(r1, r2) {
  var copy = {};
  for (var k1 in r2) {
    if ({}.hasOwnProperty.call(r2, k1)) {
      copy[k1] = r2[k1];
    }
  }
  for (var k2 in r1) {
    if ({}.hasOwnProperty.call(r1, k2)) {
      copy[k2] = r1[k2];
    }
  }
  return copy;
}

// output/Record/index.js
var merge = function() {
  return function() {
    return function(l) {
      return function(r) {
        return unsafeUnionFn(l, r);
      };
    };
  };
};
var get2 = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(l) {
      return function(r) {
        return unsafeGet(reflectSymbol2(l))(r);
      };
    };
  };
};

// output/HTTPurple.Headers/index.js
var insert2 = /* @__PURE__ */ insert(ordCaseInsensitiveString);
var unwrap2 = /* @__PURE__ */ unwrap();
var union2 = /* @__PURE__ */ union(ordCaseInsensitiveString);
var $$void3 = /* @__PURE__ */ $$void(functorEffect);
var traverseWithIndex2 = /* @__PURE__ */ traverseWithIndex(traversableWithIndexMap)(applicativeEffect);
var ResponseHeaders = function(x) {
  return x;
};
var RequestHeaders = function(x) {
  return x;
};
var semigroupResponseHeaders = {
  append: function(v) {
    return function(v1) {
      return union2(v1)(v);
    };
  }
};
var write3 = function(response) {
  return function(v) {
    var om = toOutgoingMessage(response);
    var writeField = function(key) {
      return function(values) {
        return setHeader$prime(unwrap2(key))(values)(om);
      };
    };
    return $$void3(traverseWithIndex2(writeField)(v));
  };
};
var toResponseHeaders = /* @__PURE__ */ function() {
  var $107 = map(functorMap)(singleton2);
  var $108 = un()(RequestHeaders);
  return function($109) {
    return ResponseHeaders($107($108($109)));
  };
}();
var read3 = /* @__PURE__ */ function() {
  var insertField = function(x) {
    return function(key) {
      return function(value) {
        return insert2(key)(value)(x);
      };
    };
  };
  var $110 = fold2(insertField)(empty2);
  return function($111) {
    return RequestHeaders($110(headers($111)));
  };
}();
var mkRequestHeader = function(key) {
  var $114 = singleton4(key);
  return function($115) {
    return RequestHeaders($114($115));
  };
};
var empty4 = empty2;

// output/Node.Buffer.Immutable/foreign.js
import { Buffer as Buffer2 } from "node:buffer";
var size2 = (buff) => buff.length;
var fromStringImpl = (str, encoding) => Buffer2.from(str, encoding);

// output/Node.Encoding/index.js
var ASCII = /* @__PURE__ */ function() {
  function ASCII2() {
  }
  ;
  ASCII2.value = new ASCII2();
  return ASCII2;
}();
var UTF8 = /* @__PURE__ */ function() {
  function UTF82() {
  }
  ;
  UTF82.value = new UTF82();
  return UTF82;
}();
var UTF16LE = /* @__PURE__ */ function() {
  function UTF16LE2() {
  }
  ;
  UTF16LE2.value = new UTF16LE2();
  return UTF16LE2;
}();
var UCS2 = /* @__PURE__ */ function() {
  function UCS22() {
  }
  ;
  UCS22.value = new UCS22();
  return UCS22;
}();
var Base64 = /* @__PURE__ */ function() {
  function Base642() {
  }
  ;
  Base642.value = new Base642();
  return Base642;
}();
var Base64Url = /* @__PURE__ */ function() {
  function Base64Url2() {
  }
  ;
  Base64Url2.value = new Base64Url2();
  return Base64Url2;
}();
var Latin1 = /* @__PURE__ */ function() {
  function Latin12() {
  }
  ;
  Latin12.value = new Latin12();
  return Latin12;
}();
var Binary = /* @__PURE__ */ function() {
  function Binary2() {
  }
  ;
  Binary2.value = new Binary2();
  return Binary2;
}();
var Hex = /* @__PURE__ */ function() {
  function Hex2() {
  }
  ;
  Hex2.value = new Hex2();
  return Hex2;
}();
var encodingToNode = function(v) {
  if (v instanceof ASCII) {
    return "ascii";
  }
  ;
  if (v instanceof UTF8) {
    return "utf8";
  }
  ;
  if (v instanceof UTF16LE) {
    return "utf16le";
  }
  ;
  if (v instanceof UCS2) {
    return "ucs2";
  }
  ;
  if (v instanceof Base64) {
    return "base64";
  }
  ;
  if (v instanceof Base64Url) {
    return "base64url";
  }
  ;
  if (v instanceof Latin1) {
    return "latin1";
  }
  ;
  if (v instanceof Binary) {
    return "binary";
  }
  ;
  if (v instanceof Hex) {
    return "hex";
  }
  ;
  throw new Error("Failed pattern match at Node.Encoding (line 35, column 1 - line 35, column 37): " + [v.constructor.name]);
};

// output/Node.Buffer.Immutable/index.js
var fromString = function(str) {
  return function(enc) {
    return fromStringImpl(str, encodingToNode(enc));
  };
};

// output/Node.Buffer/index.js
var pure3 = /* @__PURE__ */ pure(applicativeEffect);
var map4 = /* @__PURE__ */ map(functorEffect);
var unsafeThaw2 = function($7) {
  return pure3($7);
};
var usingToImmutable = function(f) {
  return function(x) {
    return unsafeThaw2(f(x));
  };
};
var unsafeFreeze2 = function($8) {
  return pure3($8);
};
var usingFromImmutable = function(f) {
  return function(buf) {
    return map4(f)(unsafeFreeze2(buf));
  };
};
var size3 = /* @__PURE__ */ usingFromImmutable(size2);
var fromString2 = function(s) {
  return usingToImmutable(fromString(s));
};

// output/Node.Stream/foreign.js
var writeCbImpl = (w, buf, cb) => w.write(buf, cb);
var writeStringCbImpl = (w, str, enc, cb) => w.write(str, enc, cb);
var endCbImpl = (w, cb) => w.end(cb);

// output/Node.Stream/index.js
var writeString$prime = function(w) {
  return function(enc) {
    return function(str) {
      return function(cb) {
        return function() {
          return writeStringCbImpl(w, str, encodingToNode(enc), function(err) {
            return cb(toMaybe(err))();
          });
        };
      };
    };
  };
};
var write$prime = function(w) {
  return function(b) {
    return function(cb) {
      return function() {
        return writeCbImpl(w, b, function(err) {
          return cb(toMaybe(err))();
        });
      };
    };
  };
};
var end$prime = function(w) {
  return function(cb) {
    return function() {
      return endCbImpl(w, function(err) {
        return cb(toMaybe(err))();
      });
    };
  };
};

// output/HTTPurple.Body/index.js
var $$void4 = /* @__PURE__ */ $$void(functorEffect);
var map5 = /* @__PURE__ */ map(functorEffect);
var map1 = /* @__PURE__ */ map(functorFn);
var show2 = /* @__PURE__ */ show(showInt);
var bodyBuffer = {
  defaultHeaders: function(buf) {
    return map5(map1(mkRequestHeader("Content-Length"))(show2))(size3(buf));
  },
  write: function(body) {
    return function(response) {
      return makeAff(function(done) {
        var stream = toWriteable(toOutgoingMessage(response));
        return function __do() {
          $$void4(write$prime(stream)(body)($$const(end$prime(stream)($$const(done(new Right(unit)))))))();
          return nonCanceler;
        };
      });
    };
  }
};
var write4 = function(dict) {
  return dict.write;
};
var read6 = function(request) {
  return function __do() {
    var buffer = $$new(Nothing.value)();
    var string = $$new(Nothing.value)();
    return {
      buffer,
      stream: toReadable(request),
      string
    };
  };
};
var defaultHeaders = function(dict) {
  return dict.defaultHeaders;
};
var defaultHeaders1 = /* @__PURE__ */ defaultHeaders(bodyBuffer);
var bodyString = {
  defaultHeaders: function(body) {
    return function __do() {
      var v = fromString2(body)(UTF8.value)();
      return defaultHeaders1(v)();
    };
  },
  write: function(body) {
    return function(response) {
      return makeAff(function(done) {
        var stream = toWriteable(toOutgoingMessage(response));
        return function __do() {
          $$void4(writeString$prime(stream)(UTF8.value)(body)($$const(end$prime(stream)($$const(done(new Right(unit)))))))();
          return nonCanceler;
        };
      });
    };
  }
};

// output/HTTPurple.Status/index.js
var write5 = /* @__PURE__ */ flip(setStatusCode);
var ok = 200;
var notFound = 404;
var internalServerError = 500;

// output/HTTPurple.Response/index.js
var discard2 = /* @__PURE__ */ discard(discardUnit);
var append2 = /* @__PURE__ */ append(semigroupResponseHeaders);
var send = function(dictMonadEffect) {
  return function(dictMonadAff) {
    var MonadEffect0 = dictMonadAff.MonadEffect0();
    var discard1 = discard2(MonadEffect0.Monad0().Bind1());
    var liftEffect4 = liftEffect(MonadEffect0);
    var liftAff2 = liftAff(dictMonadAff);
    return function(httpresponse) {
      return function(v) {
        return discard1(liftEffect4(write5(httpresponse)(v.status)))(function() {
          return discard1(liftEffect4(write3(httpresponse)(v.headers)))(function() {
            return liftAff2(v.writeBody(httpresponse));
          });
        });
      };
    };
  };
};
var response$prime = function(dictMonadAff) {
  var liftEffect4 = liftEffect(dictMonadAff.MonadEffect0());
  return function(dictBody) {
    var defaultHeaders2 = defaultHeaders(dictBody);
    var write6 = write4(dictBody);
    return function(status) {
      return function(headers2) {
        return function(body) {
          return liftEffect4(function __do() {
            var defaultHeaders$prime = defaultHeaders2(body)();
            return {
              status,
              headers: append2(toResponseHeaders(defaultHeaders$prime))(headers2),
              writeBody: write6(body)
            };
          });
        };
      };
    };
  };
};
var ok$prime = function(dictMonadAff) {
  var response$prime1 = response$prime(dictMonadAff);
  return function(dictBody) {
    return response$prime1(dictBody)(ok);
  };
};
var ok2 = function(dictMonadAff) {
  var ok$prime1 = ok$prime(dictMonadAff);
  return function(dictBody) {
    return ok$prime1(dictBody)(empty4);
  };
};
var internalServerError$prime = function(dictMonadAff) {
  var response$prime1 = response$prime(dictMonadAff);
  return function(dictBody) {
    return response$prime1(dictBody)(internalServerError);
  };
};
var internalServerError2 = function(dictMonadAff) {
  var internalServerError$prime1 = internalServerError$prime(dictMonadAff);
  return function(dictBody) {
    return internalServerError$prime1(dictBody)(empty4);
  };
};
var emptyResponse$prime = function(dictMonadAff) {
  var response$prime1 = response$prime(dictMonadAff)(bodyString);
  return function(status) {
    return function(headers2) {
      return response$prime1(status)(headers2)("");
    };
  };
};
var notFound$prime = function(dictMonadAff) {
  return emptyResponse$prime(dictMonadAff)(notFound);
};
var notFound2 = function(dictMonadAff) {
  return notFound$prime(dictMonadAff)(empty4);
};

// output/Data.Profunctor.Choice/index.js
var identity8 = /* @__PURE__ */ identity(categoryFn);
var right = function(dict) {
  return dict.right;
};
var left = function(dict) {
  return dict.left;
};
var splitChoice = function(dictCategory) {
  var composeFlipped2 = composeFlipped(dictCategory.Semigroupoid0());
  return function(dictChoice) {
    var left1 = left(dictChoice);
    var right1 = right(dictChoice);
    return function(l) {
      return function(r) {
        return composeFlipped2(left1(l))(right1(r));
      };
    };
  };
};
var fanin = function(dictCategory) {
  var identity1 = identity(dictCategory);
  var composeFlipped2 = composeFlipped(dictCategory.Semigroupoid0());
  var splitChoice1 = splitChoice(dictCategory);
  return function(dictChoice) {
    var dimap3 = dimap(dictChoice.Profunctor0());
    var splitChoice2 = splitChoice1(dictChoice);
    return function(l) {
      return function(r) {
        var join2 = dimap3(either(identity8)(identity8))(identity8)(identity1);
        return composeFlipped2(splitChoice2(l)(r))(join2);
      };
    };
  };
};
var choiceFn = {
  left: function(v) {
    return function(v1) {
      if (v1 instanceof Left) {
        return new Left(v(v1.value0));
      }
      ;
      if (v1 instanceof Right) {
        return new Right(v1.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Profunctor.Choice (line 32, column 1 - line 35, column 16): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  right: /* @__PURE__ */ map(functorEither),
  Profunctor0: function() {
    return profunctorFn;
  }
};

// output/Data.Array.NonEmpty.Internal/index.js
var functorNonEmptyArray = functorArray;
var foldableNonEmptyArray = foldableArray;

// output/Data.Bifoldable/index.js
var bifoldableTuple = {
  bifoldMap: function(dictMonoid) {
    var append4 = append(dictMonoid.Semigroup0());
    return function(f) {
      return function(g) {
        return function(v) {
          return append4(f(v.value0))(g(v.value1));
        };
      };
    };
  },
  bifoldr: function(f) {
    return function(g) {
      return function(z) {
        return function(v) {
          return f(v.value0)(g(v.value1)(z));
        };
      };
    };
  },
  bifoldl: function(f) {
    return function(g) {
      return function(z) {
        return function(v) {
          return g(f(z)(v.value0))(v.value1);
        };
      };
    };
  }
};
var bifoldableEither = {
  bifoldr: function(v) {
    return function(v1) {
      return function(v2) {
        return function(v3) {
          if (v3 instanceof Left) {
            return v(v3.value0)(v2);
          }
          ;
          if (v3 instanceof Right) {
            return v1(v3.value0)(v2);
          }
          ;
          throw new Error("Failed pattern match at Data.Bifoldable (line 62, column 1 - line 68, column 32): " + [v.constructor.name, v1.constructor.name, v2.constructor.name, v3.constructor.name]);
        };
      };
    };
  },
  bifoldl: function(v) {
    return function(v1) {
      return function(v2) {
        return function(v3) {
          if (v3 instanceof Left) {
            return v(v2)(v3.value0);
          }
          ;
          if (v3 instanceof Right) {
            return v1(v2)(v3.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Bifoldable (line 62, column 1 - line 68, column 32): " + [v.constructor.name, v1.constructor.name, v2.constructor.name, v3.constructor.name]);
        };
      };
    };
  },
  bifoldMap: function(dictMonoid) {
    return function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return v(v2.value0);
          }
          ;
          if (v2 instanceof Right) {
            return v1(v2.value0);
          }
          ;
          throw new Error("Failed pattern match at Data.Bifoldable (line 62, column 1 - line 68, column 32): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    };
  }
};

// output/Data.Bitraversable/index.js
var bitraverse = function(dict) {
  return dict.bitraverse;
};
var ltraverse = function(dictBitraversable) {
  var bitraverse1 = bitraverse(dictBitraversable);
  return function(dictApplicative) {
    var bitraverse22 = bitraverse1(dictApplicative);
    var pure6 = pure(dictApplicative);
    return function(f) {
      return bitraverse22(f)(pure6);
    };
  };
};
var bitraversableTuple = {
  bitraverse: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    var apply4 = apply(Apply0);
    var map11 = map(Apply0.Functor0());
    return function(f) {
      return function(g) {
        return function(v) {
          return apply4(map11(Tuple.create)(f(v.value0)))(g(v.value1));
        };
      };
    };
  },
  bisequence: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    var apply4 = apply(Apply0);
    var map11 = map(Apply0.Functor0());
    return function(v) {
      return apply4(map11(Tuple.create)(v.value0))(v.value1);
    };
  },
  Bifunctor0: function() {
    return bifunctorTuple;
  },
  Bifoldable1: function() {
    return bifoldableTuple;
  }
};
var bitraversableEither = {
  bitraverse: function(dictApplicative) {
    var map11 = map(dictApplicative.Apply0().Functor0());
    return function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return map11(Left.create)(v(v2.value0));
          }
          ;
          if (v2 instanceof Right) {
            return map11(Right.create)(v1(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Bitraversable (line 57, column 1 - line 61, column 37): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    };
  },
  bisequence: function(dictApplicative) {
    var map11 = map(dictApplicative.Apply0().Functor0());
    return function(v) {
      if (v instanceof Left) {
        return map11(Left.create)(v.value0);
      }
      ;
      if (v instanceof Right) {
        return map11(Right.create)(v.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Bitraversable (line 57, column 1 - line 61, column 37): " + [v.constructor.name]);
    };
  },
  Bifunctor0: function() {
    return bifunctorEither;
  },
  Bifoldable1: function() {
    return bifoldableEither;
  }
};

// output/Data.String.CodeUnits/foreign.js
var length2 = function(s) {
  return s.length;
};
var _indexOf = function(just) {
  return function(nothing) {
    return function(x) {
      return function(s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};
var take2 = function(n) {
  return function(s) {
    return s.substr(0, n);
  };
};
var drop2 = function(n) {
  return function(s) {
    return s.substring(n);
  };
};

// output/Data.String.CodeUnits/index.js
var indexOf = /* @__PURE__ */ function() {
  return _indexOf(Just.create)(Nothing.value);
}();

// output/JSURI/foreign.js
function _decodeURIComponent(fail, succeed, input) {
  try {
    return succeed(decodeURIComponent(input));
  } catch (err) {
    return fail(err);
  }
}

// output/JSURI/index.js
var $$decodeURIComponent = /* @__PURE__ */ function() {
  return runFn3(_decodeURIComponent)($$const(Nothing.value))(Just.create);
}();

// output/Routing.Duplex.Parser/index.js
var $runtime_lazy4 = function(name2, moduleName, init4) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init4();
    state2 = 2;
    return val;
  };
};
var bitraverse2 = /* @__PURE__ */ bitraverse(bitraversableTuple)(applicativeEither);
var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeEither);
var map6 = /* @__PURE__ */ map(functorNonEmptyArray);
var map12 = /* @__PURE__ */ map(functorFn);
var foldl2 = /* @__PURE__ */ foldl(foldableNonEmptyArray);
var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindEither);
var Expected = /* @__PURE__ */ function() {
  function Expected2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Expected2.create = function(value0) {
    return function(value1) {
      return new Expected2(value0, value1);
    };
  };
  return Expected2;
}();
var ExpectedEndOfPath = /* @__PURE__ */ function() {
  function ExpectedEndOfPath2(value0) {
    this.value0 = value0;
  }
  ;
  ExpectedEndOfPath2.create = function(value0) {
    return new ExpectedEndOfPath2(value0);
  };
  return ExpectedEndOfPath2;
}();
var MalformedURIComponent = /* @__PURE__ */ function() {
  function MalformedURIComponent2(value0) {
    this.value0 = value0;
  }
  ;
  MalformedURIComponent2.create = function(value0) {
    return new MalformedURIComponent2(value0);
  };
  return MalformedURIComponent2;
}();
var EndOfPath = /* @__PURE__ */ function() {
  function EndOfPath2() {
  }
  ;
  EndOfPath2.value = new EndOfPath2();
  return EndOfPath2;
}();
var Fail = /* @__PURE__ */ function() {
  function Fail2(value0) {
    this.value0 = value0;
  }
  ;
  Fail2.create = function(value0) {
    return new Fail2(value0);
  };
  return Fail2;
}();
var Success = /* @__PURE__ */ function() {
  function Success2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Success2.create = function(value0) {
    return function(value1) {
      return new Success2(value0, value1);
    };
  };
  return Success2;
}();
var Alt = /* @__PURE__ */ function() {
  function Alt2(value0) {
    this.value0 = value0;
  }
  ;
  Alt2.create = function(value0) {
    return new Alt2(value0);
  };
  return Alt2;
}();
var Chomp = /* @__PURE__ */ function() {
  function Chomp2(value0) {
    this.value0 = value0;
  }
  ;
  Chomp2.create = function(value0) {
    return new Chomp2(value0);
  };
  return Chomp2;
}();
var Prefix = /* @__PURE__ */ function() {
  function Prefix2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Prefix2.create = function(value0) {
    return function(value1) {
      return new Prefix2(value0, value1);
    };
  };
  return Prefix2;
}();
var take3 = /* @__PURE__ */ function() {
  return new Chomp(function(state2) {
    var v = uncons(state2.segments);
    if (v instanceof Just) {
      return new Success({
        params: state2.params,
        hash: state2.hash,
        segments: v.value0.tail
      }, v.value0.head);
    }
    ;
    return new Fail(EndOfPath.value);
  });
}();
var prefix = /* @__PURE__ */ function() {
  return Prefix.create;
}();
var parsePath = /* @__PURE__ */ function() {
  var toRouteState = function(v) {
    return {
      segments: v.value0.value0,
      params: v.value0.value1,
      hash: v.value1
    };
  };
  var splitNonEmpty = function(v) {
    return function(v1) {
      if (v1 === "") {
        return [];
      }
      ;
      return split(v)(v1);
    };
  };
  var splitAt3 = function(k) {
    return function(p) {
      return function(str) {
        var v = indexOf(p)(str);
        if (v instanceof Just) {
          return new Tuple(take2(v.value0)(str), drop2(v.value0 + length2(p) | 0)(str));
        }
        ;
        if (v instanceof Nothing) {
          return k(str);
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 191, column 5 - line 193, column 23): " + [v.constructor.name]);
      };
    };
  };
  var decodeURIComponent$prime = function(str) {
    var v = $$decodeURIComponent(str);
    if (v instanceof Nothing) {
      return new Left(new MalformedURIComponent(str));
    }
    ;
    if (v instanceof Just) {
      return new Right(v.value0);
    }
    ;
    throw new Error("Failed pattern match at Routing.Duplex.Parser (line 195, column 29 - line 197, column 22): " + [v.constructor.name]);
  };
  var splitKeyValue = function() {
    var $349 = bitraverse2(decodeURIComponent$prime)(decodeURIComponent$prime);
    var $350 = splitAt3(flip(Tuple.create)(""))("=");
    return function($351) {
      return $349($350($351));
    };
  }();
  var splitParams = function() {
    var $352 = traverse2(splitKeyValue);
    var $353 = splitNonEmpty("&");
    return function($354) {
      return $352($353($354));
    };
  }();
  var splitSegments = function() {
    var $355 = splitNonEmpty("/");
    return function($356) {
      return function(v) {
        if (v.length === 2 && (v[0] === "" && v[1] === "")) {
          return new Right([""]);
        }
        ;
        return traverse2(decodeURIComponent$prime)(v);
      }($355($356));
    };
  }();
  var splitPath = function() {
    var $357 = bitraverse2(splitSegments)(splitParams);
    var $358 = splitAt3(flip(Tuple.create)(""))("?");
    return function($359) {
      return $357($358($359));
    };
  }();
  var $360 = map(functorEither)(toRouteState);
  var $361 = ltraverse(bitraversableTuple)(applicativeEither)(splitPath);
  var $362 = splitAt3(flip(Tuple.create)(""))("#");
  return function($363) {
    return $360($361($362($363)));
  };
}();
var functorRouteResult = {
  map: function(f) {
    return function(m) {
      if (m instanceof Fail) {
        return new Fail(m.value0);
      }
      ;
      if (m instanceof Success) {
        return new Success(m.value0, f(m.value1));
      }
      ;
      throw new Error("Failed pattern match at Routing.Duplex.Parser (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
    };
  }
};
var map22 = /* @__PURE__ */ map(functorRouteResult);
var functorRouteParser = {
  map: function(f) {
    return function(m) {
      if (m instanceof Alt) {
        return new Alt(map6(map(functorRouteParser)(f))(m.value0));
      }
      ;
      if (m instanceof Chomp) {
        return new Chomp(map12(map22(f))(m.value0));
      }
      ;
      if (m instanceof Prefix) {
        return new Prefix(m.value0, map(functorRouteParser)(f)(m.value1));
      }
      ;
      throw new Error("Failed pattern match at Routing.Duplex.Parser (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
    };
  }
};
var end = /* @__PURE__ */ function() {
  return new Chomp(function(state2) {
    var v = head(state2.segments);
    if (v instanceof Nothing) {
      return new Success(state2, unit);
    }
    ;
    if (v instanceof Just) {
      return new Fail(new ExpectedEndOfPath(v.value0));
    }
    ;
    throw new Error("Failed pattern match at Routing.Duplex.Parser (line 266, column 3 - line 268, column 45): " + [v.constructor.name]);
  });
}();
var chompPrefix = function(pre) {
  return function(state2) {
    var v = head(state2.segments);
    if (v instanceof Just && pre === v.value0) {
      return new Success({
        params: state2.params,
        hash: state2.hash,
        segments: drop(1)(state2.segments)
      }, unit);
    }
    ;
    if (v instanceof Just) {
      return new Fail(new Expected(pre, v.value0));
    }
    ;
    return new Fail(EndOfPath.value);
  };
};
var $lazy_runRouteParser = /* @__PURE__ */ $runtime_lazy4("runRouteParser", "Routing.Duplex.Parser", function() {
  var goAlt = function(v) {
    return function(v1) {
      return function(v2) {
        if (v1 instanceof Fail) {
          return $lazy_runRouteParser(161)(v)(v2);
        }
        ;
        return v1;
      };
    };
  };
  var go = function($copy_state) {
    return function($copy_v) {
      var $tco_var_state = $copy_state;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(state2, v) {
        if (v instanceof Alt) {
          $tco_done = true;
          return foldl2(goAlt(state2))(new Fail(EndOfPath.value))(v.value0);
        }
        ;
        if (v instanceof Chomp) {
          $tco_done = true;
          return v.value0(state2);
        }
        ;
        if (v instanceof Prefix) {
          var v1 = chompPrefix(v.value0)(state2);
          if (v1 instanceof Fail) {
            $tco_done = true;
            return new Fail(v1.value0);
          }
          ;
          if (v1 instanceof Success) {
            $tco_var_state = v1.value0;
            $copy_v = v.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Routing.Duplex.Parser (line 157, column 7 - line 159, column 40): " + [v1.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 153, column 14 - line 159, column 40): " + [v.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_state, $copy_v);
      }
      ;
      return $tco_result;
    };
  };
  return go;
});
var runRouteParser = /* @__PURE__ */ $lazy_runRouteParser(150);
var run3 = function(p) {
  return composeKleisli2(parsePath)(function() {
    var $366 = flip(runRouteParser)(p);
    return function($367) {
      return function(v) {
        if (v instanceof Fail) {
          return new Left(v.value0);
        }
        ;
        if (v instanceof Success) {
          return new Right(v.value1);
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 200, column 49 - line 202, column 29): " + [v.constructor.name]);
      }($366($367));
    };
  }());
};
var applyRouteParser = {
  apply: function(fx) {
    return function(x) {
      return new Chomp(function(state2) {
        var v = runRouteParser(state2)(fx);
        if (v instanceof Fail) {
          return new Fail(v.value0);
        }
        ;
        if (v instanceof Success) {
          return map22(v.value1)(runRouteParser(v.value0)(x));
        }
        ;
        throw new Error("Failed pattern match at Routing.Duplex.Parser (line 81, column 5 - line 83, column 56): " + [v.constructor.name]);
      });
    };
  },
  Functor0: function() {
    return functorRouteParser;
  }
};

// output/Routing.Duplex.Printer/index.js
var semigroupRoutePrinter = {
  append: function(v) {
    return function(v1) {
      return function($33) {
        return v1(v($33));
      };
    };
  }
};
var put2 = function(str) {
  return function(state2) {
    return {
      params: state2.params,
      hash: state2.hash,
      segments: snoc(state2.segments)(str)
    };
  };
};

// output/Routing.Duplex/index.js
var append3 = /* @__PURE__ */ append(semigroupRoutePrinter);
var applyFirst2 = /* @__PURE__ */ applyFirst(applyRouteParser);
var map7 = /* @__PURE__ */ map(functorRouteParser);
var RouteDuplex = /* @__PURE__ */ function() {
  function RouteDuplex2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  RouteDuplex2.create = function(value0) {
    return function(value1) {
      return new RouteDuplex2(value0, value1);
    };
  };
  return RouteDuplex2;
}();
var segment = /* @__PURE__ */ function() {
  return new RouteDuplex(put2, take3);
}();
var profunctorRouteDuplex = {
  dimap: function(f) {
    return function(g) {
      return function(v) {
        return new RouteDuplex(function($137) {
          return v.value0(f($137));
        }, map7(g)(v.value1));
      };
    };
  }
};
var prefix2 = function(s) {
  return function(v) {
    return new RouteDuplex(function(a) {
      return append3(put2(s))(v.value0(a));
    }, prefix(s)(v.value1));
  };
};
var path = /* @__PURE__ */ function() {
  var $139 = flip(foldr(foldableArray)(prefix2));
  var $140 = split("/");
  return function($141) {
    return $139($140($141));
  };
}();
var root = /* @__PURE__ */ path("");
var parse = function(v) {
  return run3(v.value1);
};
var end2 = function(v) {
  return new RouteDuplex(v.value0, applyFirst2(v.value1)(end));
};

// output/Routing.Duplex.Generic/index.js
var identity9 = /* @__PURE__ */ identity(categoryFn);
var map8 = /* @__PURE__ */ map(functorRouteParser);
var dimap2 = /* @__PURE__ */ dimap(profunctorRouteDuplex);
var gRouteDuplexCtr = function(dict) {
  return dict.gRouteDuplexCtr;
};
var gRouteDuplex = function(dict) {
  return dict.gRouteDuplex;
};
var sum2 = function(dictGeneric) {
  var from3 = from(dictGeneric);
  var to3 = to(dictGeneric);
  return function(dictGRouteDuplex) {
    var $71 = dimap2(from3)(to3);
    var $72 = gRouteDuplex(dictGRouteDuplex)(end2);
    return function($73) {
      return $71($72($73));
    };
  };
};
var gRouteConstructor = function(dictIsSymbol) {
  var get3 = get2(dictIsSymbol)();
  return function() {
    return function(dictGRouteDuplexCtr) {
      var gRouteDuplexCtr1 = gRouteDuplexCtr(dictGRouteDuplexCtr);
      return {
        gRouteDuplex: function(end$prime2) {
          return function(r) {
            var v = end$prime2(gRouteDuplexCtr1(get3($$Proxy.value)(r)));
            var enc = function(v1) {
              return v.value0(v1);
            };
            var dec = map8(Constructor)(v.value1);
            return new RouteDuplex(enc, dec);
          };
        }
      };
    };
  };
};
var gRouteArgument = {
  gRouteDuplexCtr: identity9
};
var gRouteAll = {
  gRouteDuplexCtr: function(v) {
    return new RouteDuplex(function(v1) {
      return v.value0(v1);
    }, map8(Argument)(v.value1));
  }
};

// output/HTTPurple.Routes/index.js
var mkRoute = function(dictGeneric) {
  var sum3 = sum2(dictGeneric);
  return function(dictGRouteDuplex) {
    var $33 = sum3(dictGRouteDuplex);
    return function($34) {
      return root($33($34));
    };
  };
};

// output/Data.Posix.Signal/index.js
var SIGABRT = /* @__PURE__ */ function() {
  function SIGABRT2() {
  }
  ;
  SIGABRT2.value = new SIGABRT2();
  return SIGABRT2;
}();
var SIGALRM = /* @__PURE__ */ function() {
  function SIGALRM2() {
  }
  ;
  SIGALRM2.value = new SIGALRM2();
  return SIGALRM2;
}();
var SIGBUS = /* @__PURE__ */ function() {
  function SIGBUS2() {
  }
  ;
  SIGBUS2.value = new SIGBUS2();
  return SIGBUS2;
}();
var SIGCHLD = /* @__PURE__ */ function() {
  function SIGCHLD2() {
  }
  ;
  SIGCHLD2.value = new SIGCHLD2();
  return SIGCHLD2;
}();
var SIGCLD = /* @__PURE__ */ function() {
  function SIGCLD2() {
  }
  ;
  SIGCLD2.value = new SIGCLD2();
  return SIGCLD2;
}();
var SIGCONT = /* @__PURE__ */ function() {
  function SIGCONT2() {
  }
  ;
  SIGCONT2.value = new SIGCONT2();
  return SIGCONT2;
}();
var SIGEMT = /* @__PURE__ */ function() {
  function SIGEMT2() {
  }
  ;
  SIGEMT2.value = new SIGEMT2();
  return SIGEMT2;
}();
var SIGFPE = /* @__PURE__ */ function() {
  function SIGFPE2() {
  }
  ;
  SIGFPE2.value = new SIGFPE2();
  return SIGFPE2;
}();
var SIGHUP = /* @__PURE__ */ function() {
  function SIGHUP2() {
  }
  ;
  SIGHUP2.value = new SIGHUP2();
  return SIGHUP2;
}();
var SIGILL = /* @__PURE__ */ function() {
  function SIGILL2() {
  }
  ;
  SIGILL2.value = new SIGILL2();
  return SIGILL2;
}();
var SIGINFO = /* @__PURE__ */ function() {
  function SIGINFO2() {
  }
  ;
  SIGINFO2.value = new SIGINFO2();
  return SIGINFO2;
}();
var SIGINT = /* @__PURE__ */ function() {
  function SIGINT2() {
  }
  ;
  SIGINT2.value = new SIGINT2();
  return SIGINT2;
}();
var SIGIO = /* @__PURE__ */ function() {
  function SIGIO2() {
  }
  ;
  SIGIO2.value = new SIGIO2();
  return SIGIO2;
}();
var SIGIOT = /* @__PURE__ */ function() {
  function SIGIOT2() {
  }
  ;
  SIGIOT2.value = new SIGIOT2();
  return SIGIOT2;
}();
var SIGKILL = /* @__PURE__ */ function() {
  function SIGKILL2() {
  }
  ;
  SIGKILL2.value = new SIGKILL2();
  return SIGKILL2;
}();
var SIGLOST = /* @__PURE__ */ function() {
  function SIGLOST2() {
  }
  ;
  SIGLOST2.value = new SIGLOST2();
  return SIGLOST2;
}();
var SIGPIPE = /* @__PURE__ */ function() {
  function SIGPIPE2() {
  }
  ;
  SIGPIPE2.value = new SIGPIPE2();
  return SIGPIPE2;
}();
var SIGPOLL = /* @__PURE__ */ function() {
  function SIGPOLL2() {
  }
  ;
  SIGPOLL2.value = new SIGPOLL2();
  return SIGPOLL2;
}();
var SIGPROF = /* @__PURE__ */ function() {
  function SIGPROF2() {
  }
  ;
  SIGPROF2.value = new SIGPROF2();
  return SIGPROF2;
}();
var SIGPWR = /* @__PURE__ */ function() {
  function SIGPWR2() {
  }
  ;
  SIGPWR2.value = new SIGPWR2();
  return SIGPWR2;
}();
var SIGQUIT = /* @__PURE__ */ function() {
  function SIGQUIT2() {
  }
  ;
  SIGQUIT2.value = new SIGQUIT2();
  return SIGQUIT2;
}();
var SIGSEGV = /* @__PURE__ */ function() {
  function SIGSEGV2() {
  }
  ;
  SIGSEGV2.value = new SIGSEGV2();
  return SIGSEGV2;
}();
var SIGSTKFLT = /* @__PURE__ */ function() {
  function SIGSTKFLT2() {
  }
  ;
  SIGSTKFLT2.value = new SIGSTKFLT2();
  return SIGSTKFLT2;
}();
var SIGSTOP = /* @__PURE__ */ function() {
  function SIGSTOP2() {
  }
  ;
  SIGSTOP2.value = new SIGSTOP2();
  return SIGSTOP2;
}();
var SIGSYS = /* @__PURE__ */ function() {
  function SIGSYS2() {
  }
  ;
  SIGSYS2.value = new SIGSYS2();
  return SIGSYS2;
}();
var SIGTERM = /* @__PURE__ */ function() {
  function SIGTERM2() {
  }
  ;
  SIGTERM2.value = new SIGTERM2();
  return SIGTERM2;
}();
var SIGTRAP = /* @__PURE__ */ function() {
  function SIGTRAP2() {
  }
  ;
  SIGTRAP2.value = new SIGTRAP2();
  return SIGTRAP2;
}();
var SIGTSTP = /* @__PURE__ */ function() {
  function SIGTSTP2() {
  }
  ;
  SIGTSTP2.value = new SIGTSTP2();
  return SIGTSTP2;
}();
var SIGTTIN = /* @__PURE__ */ function() {
  function SIGTTIN2() {
  }
  ;
  SIGTTIN2.value = new SIGTTIN2();
  return SIGTTIN2;
}();
var SIGTTOU = /* @__PURE__ */ function() {
  function SIGTTOU2() {
  }
  ;
  SIGTTOU2.value = new SIGTTOU2();
  return SIGTTOU2;
}();
var SIGUNUSED = /* @__PURE__ */ function() {
  function SIGUNUSED2() {
  }
  ;
  SIGUNUSED2.value = new SIGUNUSED2();
  return SIGUNUSED2;
}();
var SIGURG = /* @__PURE__ */ function() {
  function SIGURG2() {
  }
  ;
  SIGURG2.value = new SIGURG2();
  return SIGURG2;
}();
var SIGUSR1 = /* @__PURE__ */ function() {
  function SIGUSR12() {
  }
  ;
  SIGUSR12.value = new SIGUSR12();
  return SIGUSR12;
}();
var SIGUSR2 = /* @__PURE__ */ function() {
  function SIGUSR22() {
  }
  ;
  SIGUSR22.value = new SIGUSR22();
  return SIGUSR22;
}();
var SIGVTALRM = /* @__PURE__ */ function() {
  function SIGVTALRM2() {
  }
  ;
  SIGVTALRM2.value = new SIGVTALRM2();
  return SIGVTALRM2;
}();
var SIGWINCH = /* @__PURE__ */ function() {
  function SIGWINCH2() {
  }
  ;
  SIGWINCH2.value = new SIGWINCH2();
  return SIGWINCH2;
}();
var SIGXCPU = /* @__PURE__ */ function() {
  function SIGXCPU2() {
  }
  ;
  SIGXCPU2.value = new SIGXCPU2();
  return SIGXCPU2;
}();
var SIGXFSZ = /* @__PURE__ */ function() {
  function SIGXFSZ2() {
  }
  ;
  SIGXFSZ2.value = new SIGXFSZ2();
  return SIGXFSZ2;
}();
var toString3 = function(s) {
  if (s instanceof SIGABRT) {
    return "SIGABRT";
  }
  ;
  if (s instanceof SIGALRM) {
    return "SIGALRM";
  }
  ;
  if (s instanceof SIGBUS) {
    return "SIGBUS";
  }
  ;
  if (s instanceof SIGCHLD) {
    return "SIGCHLD";
  }
  ;
  if (s instanceof SIGCLD) {
    return "SIGCLD";
  }
  ;
  if (s instanceof SIGCONT) {
    return "SIGCONT";
  }
  ;
  if (s instanceof SIGEMT) {
    return "SIGEMT";
  }
  ;
  if (s instanceof SIGFPE) {
    return "SIGFPE";
  }
  ;
  if (s instanceof SIGHUP) {
    return "SIGHUP";
  }
  ;
  if (s instanceof SIGILL) {
    return "SIGILL";
  }
  ;
  if (s instanceof SIGINFO) {
    return "SIGINFO";
  }
  ;
  if (s instanceof SIGINT) {
    return "SIGINT";
  }
  ;
  if (s instanceof SIGIO) {
    return "SIGIO";
  }
  ;
  if (s instanceof SIGIOT) {
    return "SIGIOT";
  }
  ;
  if (s instanceof SIGKILL) {
    return "SIGKILL";
  }
  ;
  if (s instanceof SIGLOST) {
    return "SIGLOST";
  }
  ;
  if (s instanceof SIGPIPE) {
    return "SIGPIPE";
  }
  ;
  if (s instanceof SIGPOLL) {
    return "SIGPOLL";
  }
  ;
  if (s instanceof SIGPROF) {
    return "SIGPROF";
  }
  ;
  if (s instanceof SIGPWR) {
    return "SIGPWR";
  }
  ;
  if (s instanceof SIGQUIT) {
    return "SIGQUIT";
  }
  ;
  if (s instanceof SIGSEGV) {
    return "SIGSEGV";
  }
  ;
  if (s instanceof SIGSTKFLT) {
    return "SIGSTKFLT";
  }
  ;
  if (s instanceof SIGSTOP) {
    return "SIGSTOP";
  }
  ;
  if (s instanceof SIGSYS) {
    return "SIGSYS";
  }
  ;
  if (s instanceof SIGTERM) {
    return "SIGTERM";
  }
  ;
  if (s instanceof SIGTRAP) {
    return "SIGTRAP";
  }
  ;
  if (s instanceof SIGTSTP) {
    return "SIGTSTP";
  }
  ;
  if (s instanceof SIGTTIN) {
    return "SIGTTIN";
  }
  ;
  if (s instanceof SIGTTOU) {
    return "SIGTTOU";
  }
  ;
  if (s instanceof SIGUNUSED) {
    return "SIGUNUSED";
  }
  ;
  if (s instanceof SIGURG) {
    return "SIGURG";
  }
  ;
  if (s instanceof SIGUSR1) {
    return "SIGUSR1";
  }
  ;
  if (s instanceof SIGUSR2) {
    return "SIGUSR2";
  }
  ;
  if (s instanceof SIGVTALRM) {
    return "SIGVTALRM";
  }
  ;
  if (s instanceof SIGWINCH) {
    return "SIGWINCH";
  }
  ;
  if (s instanceof SIGXCPU) {
    return "SIGXCPU";
  }
  ;
  if (s instanceof SIGXFSZ) {
    return "SIGXFSZ";
  }
  ;
  throw new Error("Failed pattern match at Data.Posix.Signal (line 48, column 14 - line 86, column 24): " + [s.constructor.name]);
};

// output/Effect.Console/foreign.js
var log2 = function(s) {
  return function() {
    console.log(s);
  };
};
var error2 = function(s) {
  return function() {
    console.error(s);
  };
};

// output/Effect.Class.Console/index.js
var log3 = function(dictMonadEffect) {
  var $67 = liftEffect(dictMonadEffect);
  return function($68) {
    return $67(log2($68));
  };
};

// output/Foreign/foreign.js
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output/Data.List/index.js
var map9 = /* @__PURE__ */ map(functorMaybe);
var uncons2 = function(v) {
  if (v instanceof Nil) {
    return Nothing.value;
  }
  ;
  if (v instanceof Cons) {
    return new Just({
      head: v.value0,
      tail: v.value1
    });
  }
  ;
  throw new Error("Failed pattern match at Data.List (line 259, column 1 - line 259, column 66): " + [v.constructor.name]);
};
var toUnfoldable2 = function(dictUnfoldable) {
  return unfoldr(dictUnfoldable)(function(xs) {
    return map9(function(rec) {
      return new Tuple(rec.head, rec.tail);
    })(uncons2(xs));
  });
};

// output/HTTPurple.NodeMiddleware/index.js
var NotCalled = /* @__PURE__ */ function() {
  function NotCalled2() {
  }
  ;
  NotCalled2.value = new NotCalled2();
  return NotCalled2;
}();
var ProcessingFailed = /* @__PURE__ */ function() {
  function ProcessingFailed2(value0) {
    this.value0 = value0;
  }
  ;
  ProcessingFailed2.create = function(value0) {
    return new ProcessingFailed2(value0);
  };
  return ProcessingFailed2;
}();
var ProcessingSucceeded = /* @__PURE__ */ function() {
  function ProcessingSucceeded2() {
  }
  ;
  ProcessingSucceeded2.value = new ProcessingSucceeded2();
  return ProcessingSucceeded2;
}();

// output/HTTPurple.Method/index.js
var Get = /* @__PURE__ */ function() {
  function Get2() {
  }
  ;
  Get2.value = new Get2();
  return Get2;
}();
var Post = /* @__PURE__ */ function() {
  function Post2() {
  }
  ;
  Post2.value = new Post2();
  return Post2;
}();
var Put = /* @__PURE__ */ function() {
  function Put2() {
  }
  ;
  Put2.value = new Put2();
  return Put2;
}();
var Delete = /* @__PURE__ */ function() {
  function Delete2() {
  }
  ;
  Delete2.value = new Delete2();
  return Delete2;
}();
var Head = /* @__PURE__ */ function() {
  function Head2() {
  }
  ;
  Head2.value = new Head2();
  return Head2;
}();
var Connect = /* @__PURE__ */ function() {
  function Connect2() {
  }
  ;
  Connect2.value = new Connect2();
  return Connect2;
}();
var Options = /* @__PURE__ */ function() {
  function Options2() {
  }
  ;
  Options2.value = new Options2();
  return Options2;
}();
var Trace = /* @__PURE__ */ function() {
  function Trace2() {
  }
  ;
  Trace2.value = new Trace2();
  return Trace2;
}();
var Patch = /* @__PURE__ */ function() {
  function Patch2() {
  }
  ;
  Patch2.value = new Patch2();
  return Patch2;
}();
var read7 = function($9) {
  return function(v) {
    if (v === "POST") {
      return Post.value;
    }
    ;
    if (v === "PUT") {
      return Put.value;
    }
    ;
    if (v === "DELETE") {
      return Delete.value;
    }
    ;
    if (v === "HEAD") {
      return Head.value;
    }
    ;
    if (v === "CONNECT") {
      return Connect.value;
    }
    ;
    if (v === "OPTIONS") {
      return Options.value;
    }
    ;
    if (v === "TRACE") {
      return Trace.value;
    }
    ;
    if (v === "PATCH") {
      return Patch.value;
    }
    ;
    return Get.value;
  }(method($9));
};

// output/Data.String.Pattern/index.js
var Pattern = function(x) {
  return x;
};

// output/HTTPurple.Utils/index.js
var urlDecode = function(s) {
  return fromMaybe(s)($$decodeURIComponent(s));
};
var replacePlus = /* @__PURE__ */ replaceAll("+")("%20");

// output/HTTPurple.Path/index.js
var read8 = /* @__PURE__ */ function() {
  var split$prime = function($3) {
    return split(Pattern($3));
  };
  var nonempty = filter(notEq(eqString)(""));
  var first = function() {
    var $4 = fromMaybe("");
    return function($5) {
      return $4(head($5));
    };
  }();
  var $6 = map(functorArray)(urlDecode);
  var $7 = split$prime("/");
  var $8 = split$prime("?");
  return function($9) {
    return $6(nonempty($7(first($8(url($9))))));
  };
}();

// output/HTTPurple.Query/index.js
var read9 = /* @__PURE__ */ function() {
  var split$prime = function($5) {
    return split(Pattern($5));
  };
  var nonempty = filter(notEq(eqString)(""));
  var last4 = function() {
    var $6 = joinWith("");
    var $7 = fromMaybe([]);
    return function($8) {
      return $6($7(tail($8)));
    };
  }();
  var first = function() {
    var $9 = fromMaybe("");
    return function($10) {
      return $9(head($10));
    };
  }();
  var decode = function($11) {
    return urlDecode(replacePlus($11));
  };
  var decodeKeyValue = bimap(bifunctorTuple)(decode)(decode);
  var toTuple = function(item) {
    var itemParts = split$prime("=")(item);
    return decodeKeyValue(new Tuple(first(itemParts), last4(itemParts)));
  };
  var toObject = function() {
    var $12 = fromFoldable2(foldableArray);
    var $13 = map(functorArray)(toTuple);
    return function($14) {
      return $12($13($14));
    };
  }();
  var $15 = split$prime("&");
  var $16 = split$prime("?");
  return function($17) {
    return toObject(nonempty($15(last4($16(url($17))))));
  };
}();

// output/HTTPurple.Version/index.js
var HTTP0_9 = /* @__PURE__ */ function() {
  function HTTP0_92() {
  }
  ;
  HTTP0_92.value = new HTTP0_92();
  return HTTP0_92;
}();
var HTTP1_0 = /* @__PURE__ */ function() {
  function HTTP1_02() {
  }
  ;
  HTTP1_02.value = new HTTP1_02();
  return HTTP1_02;
}();
var HTTP1_1 = /* @__PURE__ */ function() {
  function HTTP1_12() {
  }
  ;
  HTTP1_12.value = new HTTP1_12();
  return HTTP1_12;
}();
var HTTP2_0 = /* @__PURE__ */ function() {
  function HTTP2_02() {
  }
  ;
  HTTP2_02.value = new HTTP2_02();
  return HTTP2_02;
}();
var HTTP3_0 = /* @__PURE__ */ function() {
  function HTTP3_02() {
  }
  ;
  HTTP3_02.value = new HTTP3_02();
  return HTTP3_02;
}();
var Other = /* @__PURE__ */ function() {
  function Other2(value0) {
    this.value0 = value0;
  }
  ;
  Other2.create = function(value0) {
    return new Other2(value0);
  };
  return Other2;
}();
var read10 = function($16) {
  return function(v) {
    if (v === "0.9") {
      return HTTP0_9.value;
    }
    ;
    if (v === "1.0") {
      return HTTP1_0.value;
    }
    ;
    if (v === "1.1") {
      return HTTP1_1.value;
    }
    ;
    if (v === "2.0") {
      return HTTP2_0.value;
    }
    ;
    if (v === "3.0") {
      return HTTP3_0.value;
    }
    ;
    return new Other(v);
  }(httpVersion($16));
};

// output/Record.Studio.Shrink/foreign.js
var shrinkImpl = (keys3) => (record) => {
  return keys3.reduce((acc, key) => {
    acc[key] = record[key];
    return acc;
  }, {});
};

// output/Record.Studio.Keys/index.js
var mempty2 = /* @__PURE__ */ mempty(monoidList);
var toUnfoldable3 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
var keysRLNil = {
  keysImpl: function(v) {
    return mempty2;
  }
};
var keysImpl = function(dict) {
  return dict.keysImpl;
};
var keys1 = function() {
  return function(dictKeysRL) {
    var keysImpl1 = keysImpl(dictKeysRL);
    return {
      keys: function(v) {
        return toUnfoldable3(keysImpl1($$Proxy.value));
      }
    };
  };
};
var keys2 = function(dict) {
  return dict.keys;
};

// output/Record.Studio.Shrink/index.js
var shrink = function() {
  return function(dictKeys) {
    return shrinkImpl(keys2(dictKeys)($$Proxy.value));
  };
};

// output/HTTPurple.Request/index.js
var bitraverse3 = /* @__PURE__ */ bitraverse(bitraversableEither)(applicativeAff);
var shrink2 = /* @__PURE__ */ shrink();
var merge2 = /* @__PURE__ */ merge()();
var bind2 = /* @__PURE__ */ bind(bindAff);
var pure4 = /* @__PURE__ */ pure(applicativeAff);
var rmap2 = /* @__PURE__ */ rmap(bifunctorEither);
var ExtRequestNT = function(x) {
  return x;
};
var mkRequest = function(dictMonadEffect) {
  var Monad0 = dictMonadEffect.Monad0();
  var bind1 = bind(Monad0.Bind1());
  var liftEffect4 = liftEffect(dictMonadEffect);
  var pure12 = pure(Monad0.Applicative0());
  return function(request) {
    return function(route2) {
      return bind1(liftEffect4(read6(request)))(function(body) {
        return pure12({
          method: read7(request),
          path: read8(request),
          query: read9(request),
          route: route2,
          headers: read3(request),
          body,
          httpVersion: read10(request),
          url: url(request)
        });
      });
    };
  };
};
var mkRequest1 = /* @__PURE__ */ mkRequest(monadEffectAff);
var fromHTTPRequestUnit = /* @__PURE__ */ flip(mkRequest1)(unit);
var fromHTTPRequest = function(route2) {
  return function(request) {
    return bitraverse3($$const(mkRequest1(request)(unit)))(mkRequest1(request))(parse(route2)(url(request)));
  };
};
var fromHTTPRequestExt = function() {
  return function() {
    return function() {
      return function(dictKeys) {
        var shrink1 = shrink2(dictKeys);
        return function(route2) {
          return function(v) {
            return function(nodeRequest) {
              var extension = shrink1(nodeRequest);
              var addExtension = function() {
                var $27 = flip(merge2)(extension);
                return function($28) {
                  return ExtRequestNT($27($28));
                };
              }();
              return bind2(fromHTTPRequest(route2)(nodeRequest))(function(request) {
                return pure4(rmap2(addExtension)(request));
              });
            };
          };
        };
      };
    };
  };
};

// output/Record.Builder/foreign.js
function copyRecord(rec) {
  var copy = {};
  for (var key in rec) {
    if ({}.hasOwnProperty.call(rec, key)) {
      copy[key] = rec[key];
    }
  }
  return copy;
}
function unsafeInsert(l) {
  return function(a) {
    return function(rec) {
      rec[l] = a;
      return rec;
    };
  };
}

// output/Record.Builder/index.js
var semigroupoidBuilder = semigroupoidFn;
var insert5 = function() {
  return function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(l) {
        return function(a) {
          return function(r1) {
            return unsafeInsert(reflectSymbol2(l))(a)(r1);
          };
        };
      };
    };
  };
};
var disjointUnion = function() {
  return function() {
    return function(r1) {
      return function(r2) {
        return unsafeUnionFn(r1, r2);
      };
    };
  };
};
var categoryBuilder = categoryFn;
var build = function(v) {
  return function(r1) {
    return v(copyRecord(r1));
  };
};

// output/Justifill.Fillable/index.js
var compose2 = /* @__PURE__ */ compose(semigroupoidBuilder);
var disjointUnion2 = /* @__PURE__ */ disjointUnion()();
var identity10 = /* @__PURE__ */ identity(categoryBuilder);
var insert6 = /* @__PURE__ */ insert5()();
var getFillableFields = function(dict) {
  return dict.getFillableFields;
};
var fillableRecord = function() {
  return function(dictFillableFields) {
    var getFillableFields1 = getFillableFields(dictFillableFields);
    return function() {
      return function() {
        return {
          fill: function(o) {
            return build(compose2(disjointUnion2(o))(getFillableFields1($$Proxy.value)))({});
          }
        };
      };
    };
  };
};
var fillableFieldsNil = {
  getFillableFields: function(v) {
    return identity10;
  }
};
var fillableFieldsCons = function(dictIsSymbol) {
  var insert1 = insert6(dictIsSymbol);
  return function(dictFillableFields) {
    var getFillableFields1 = getFillableFields(dictFillableFields);
    return function() {
      return function() {
        return {
          getFillableFields: function(v) {
            var rest2 = getFillableFields1($$Proxy.value);
            var first = insert1($$Proxy.value)(Nothing.value);
            return compose2(first)(rest2);
          }
        };
      };
    };
  };
};
var fill = function(dict) {
  return dict.fill;
};

// output/Justifill.Justifiable/index.js
var identity11 = /* @__PURE__ */ identity(categoryBuilder);
var insert7 = /* @__PURE__ */ insert5()();
var compose3 = /* @__PURE__ */ compose(semigroupoidBuilder);
var justify = function(dict) {
  return dict.justify;
};
var justifiableFieldsNil = {
  getFieldsJustified: function(v) {
    return function(v1) {
      return identity11;
    };
  }
};
var justifiableAToMaybe = /* @__PURE__ */ function() {
  return {
    justify: Just.create
  };
}();
var getFieldsJustified = function(dict) {
  return dict.getFieldsJustified;
};
var justifiableFieldsCons = function(dictIsSymbol) {
  var get3 = get2(dictIsSymbol)();
  var insert1 = insert7(dictIsSymbol);
  return function() {
    return function() {
      return function() {
        return function(dictJustifiableFields) {
          var getFieldsJustified1 = getFieldsJustified(dictJustifiableFields);
          return function(dictJustifiable) {
            var justify1 = justify(dictJustifiable);
            return {
              getFieldsJustified: function(v) {
                return function(r) {
                  var rest2 = getFieldsJustified1($$Proxy.value)(r);
                  var val = get3($$Proxy.value)(r);
                  var first = insert1($$Proxy.value)(justify1(val));
                  return compose3(first)(rest2);
                };
              }
            };
          };
        };
      };
    };
  };
};
var justifiableRecord = function() {
  return function(dictJustifiableFields) {
    var getFieldsJustified1 = getFieldsJustified(dictJustifiableFields);
    return {
      justify: function(x) {
        var builder = getFieldsJustified1($$Proxy.value)(x);
        return build(builder)({});
      }
    };
  };
};

// output/Justifill/index.js
var justifill = function(dictFillable) {
  var fill2 = fill(dictFillable);
  return function(dictJustifiable) {
    var $11 = justify(dictJustifiable);
    return function($12) {
      return fill2($11($12));
    };
  };
};

// output/Node.FS.Sync/foreign.js
import {
  accessSync,
  copyFileSync,
  mkdtempSync,
  renameSync,
  truncateSync,
  chownSync,
  chmodSync,
  statSync,
  lstatSync,
  linkSync,
  symlinkSync,
  readlinkSync,
  realpathSync,
  unlinkSync,
  rmdirSync,
  rmSync,
  mkdirSync,
  readdirSync,
  utimesSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  openSync,
  readSync,
  writeSync,
  fsyncSync,
  closeSync
} from "node:fs";

// output/Node.FS.Constants/foreign.js
import { constants } from "node:fs";
var f_OK = constants.F_OK;
var r_OK = constants.R_OK;
var w_OK = constants.W_OK;
var x_OK = constants.X_OK;
var copyFile_EXCL = constants.COPYFILE_EXCL;
var copyFile_FICLONE = constants.COPYFILE_FICLONE;
var copyFile_FICLONE_FORCE = constants.COPYFILE_FICLONE_FORCE;

// output/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";

// output/Node.FS.Sync/index.js
var readFile = function(file) {
  return function() {
    return readFileSync(file, {});
  };
};

// output/Node.HTTP/foreign.js
import http from "node:http";
var createServer = () => http.createServer();
var maxHeaderSize = http.maxHeaderSize;

// output/Node.HTTP.Server/index.js
var toNetServer = unsafeCoerce2;
var requestH = /* @__PURE__ */ function() {
  return new EventHandle("request", function(cb) {
    return function(a, b) {
      return cb(a)(b)();
    };
  });
}();

// output/Node.HTTPS/foreign.js
import https from "node:https";
var createSecureServerOptsImpl = (opts) => https.createServer(opts);

// output/Node.HTTPS/index.js
var createSecureServer$prime = function() {
  return function(opts) {
    return function() {
      return createSecureServerOptsImpl(opts);
    };
  };
};

// output/Node.Net.Server/foreign.js
var closeImpl = (s) => s.close();
var listenImpl = (s, o) => s.listen(o);

// output/Node.Net.Server/index.js
var identity12 = /* @__PURE__ */ identity(categoryFn);
var listeningH = /* @__PURE__ */ function() {
  return new EventHandle("listening", identity12);
}();
var listenTcp = function() {
  return function(s) {
    return function(o) {
      return function() {
        return listenImpl(s, o);
      };
    };
  };
};
var close = function(s) {
  return function() {
    return closeImpl(s);
  };
};

// output/Node.Process/foreign.js
import process from "process";
var abortImpl = process.abort ? () => process.abort() : null;
var channelRefImpl = process.channel && process.channel.ref ? () => process.channel.ref() : null;
var channelUnrefImpl = process.channel && process.channel.unref ? () => process.channel.unref() : null;
var debugPort = process.debugPort;
var disconnectImpl = process.disconnect ? () => process.disconnect() : null;
var pid = process.pid;
var platformStr = process.platform;
var ppid = process.ppid;
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var stdinIsTTY = process.stdinIsTTY;
var stdoutIsTTY = process.stdoutIsTTY;
var stderrIsTTY = process.stderrIsTTY;
var version = process.version;

// output/Node.Process/index.js
var identity13 = /* @__PURE__ */ identity(categoryFn);
var mkSignalH = function(sig) {
  return new EventHandle(toString3(sig), identity13);
};

// output/HTTPurple.Server/index.js
var pure5 = /* @__PURE__ */ pure(applicativeEffect);
var discard3 = /* @__PURE__ */ discard(discardUnit);
var log4 = /* @__PURE__ */ log3(monadEffectEffect);
var catchError2 = /* @__PURE__ */ catchError(monadErrorAff);
var discard22 = /* @__PURE__ */ discard3(bindAff);
var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
var internalServerError3 = /* @__PURE__ */ internalServerError2(monadAffAff)(bodyString);
var $$void5 = /* @__PURE__ */ $$void(functorEffect);
var bind3 = /* @__PURE__ */ bind(bindAff);
var send2 = /* @__PURE__ */ send(monadEffectAff)(monadAffAff);
var fromHTTPRequestExt2 = /* @__PURE__ */ fromHTTPRequestExt()()();
var fanin2 = /* @__PURE__ */ fanin(categoryFn)(choiceFn);
var show3 = /* @__PURE__ */ show(showInt);
var pure1 = /* @__PURE__ */ pure(applicativeAff);
var coerce3 = /* @__PURE__ */ coerce();
var fillableRecord2 = /* @__PURE__ */ fillableRecord();
var justifiableRecord2 = /* @__PURE__ */ justifiableRecord();
var merge3 = /* @__PURE__ */ merge()();
var keys12 = /* @__PURE__ */ keys1();
var apply3 = /* @__PURE__ */ apply(applyMaybe);
var map10 = /* @__PURE__ */ map(functorMaybe);
var createSecureServer$prime2 = /* @__PURE__ */ createSecureServer$prime();
var listenTcp2 = /* @__PURE__ */ listenTcp();
var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectEffect);
var applySecond2 = /* @__PURE__ */ applySecond(applyEffect);
var NoClosingHandler = /* @__PURE__ */ function() {
  function NoClosingHandler2() {
  }
  ;
  NoClosingHandler2.value = new NoClosingHandler2();
  return NoClosingHandler2;
}();
var registerClosingHandler = function(v) {
  return function(v1) {
    if (v instanceof Just && v.value0 instanceof NoClosingHandler) {
      return pure5(v1);
    }
    ;
    return function __do() {
      on_(mkSignalH(SIGINT.value))(v1(log4("Aye, stopping service now. Goodbye!")))(process)();
      on_(mkSignalH(SIGTERM.value))(v1(log4("Arrgghh I got stabbed in the back \u{1F5E1} ... good...bye...")))(process)();
      return v1;
    };
  };
};
var onError500 = function(router) {
  return function(request) {
    return catchError2(router(request))(function(err) {
      return discard22(liftEffect3(error2(message(err))))(function() {
        return internalServerError3("Internal server error");
      });
    });
  };
};
var handleRequestUnit = function(router) {
  return function(request) {
    return function(httpresponse) {
      return $$void5(runAff(function(v) {
        return pure5(unit);
      })(bind3(bind3(fromHTTPRequestUnit(request))(onError500(router)))(send2(httpresponse))));
    };
  };
};
var handleExtRequest = function() {
  return function() {
    return function(dictKeys) {
      var fromHTTPRequestExt1 = fromHTTPRequestExt2(dictKeys);
      return function() {
        return function(v) {
          return function(req2) {
            return function(resp) {
              return bind3(fromHTTPRequestExt1(v.route)($$Proxy.value)(req2))(function(httpurpleReq) {
                return bind3(fanin2(v.notFoundHandler)(onError500(v.router))(httpurpleReq))(function(httpurpleResp) {
                  return send2(resp)(httpurpleResp);
                });
              });
            };
          };
        };
      };
    };
  };
};
var handleExtRequest1 = /* @__PURE__ */ handleExtRequest()();
var handleRequest = function() {
  return function() {
    return function(dictKeys) {
      var handleExtRequest2 = handleExtRequest1(dictKeys)();
      return function() {
        return function(settings) {
          return function(request) {
            return function(response) {
              return $$void5(runAff(function(v) {
                return pure5(unit);
              })(handleExtRequest2(settings)(request)(response)));
            };
          };
        };
      };
    };
  };
};
var handleRequest1 = /* @__PURE__ */ handleRequest()();
var defaultPort = 8080;
var defaultOnStart = function(hostname) {
  return function(port) {
    return log4("HTTPurple \u{1FA81} up and running on http://" + (hostname + (":" + show3(port))));
  };
};
var defaultNotFoundHandler = /* @__PURE__ */ $$const(/* @__PURE__ */ notFound2(monadAffAff));
var defaultMiddlewareErrorHandler = function(err) {
  return function(v) {
    return discard22(liftEffect3(error2(message(err))))(function() {
      return internalServerError3("Internal server error");
    });
  };
};
var handleExtRequestWithMiddleware = function() {
  return function() {
    return function(dictKeys) {
      var handleExtRequest2 = handleExtRequest1(dictKeys)();
      return function() {
        return function(v) {
          return function(req2) {
            return function(resp) {
              var executeHandler = function(v1) {
                if (v1.middlewareResult instanceof ProcessingFailed) {
                  return liftEffect3(handleRequestUnit(defaultMiddlewareErrorHandler(v1.middlewareResult.value0))(v1.request)(v1.response));
                }
                ;
                if (v1.middlewareResult instanceof ProcessingSucceeded) {
                  return handleExtRequest2({
                    route: v.route,
                    router: v.router,
                    notFoundHandler: v.notFoundHandler
                  })(v1.request)(v1.response);
                }
                ;
                if (v1.middlewareResult instanceof NotCalled) {
                  return pure1(unit);
                }
                ;
                throw new Error("Failed pattern match at HTTPurple.Server (line 174, column 3 - line 174, column 56): " + [v1.constructor.name]);
              };
              return $$void5(runAff(function(v1) {
                return pure5(unit);
              })(bind3(liftEffect3(flip(runContT)(function($141) {
                return pure5(coerce3($141));
              })(v.nodeMiddleware({
                request: req2,
                response: resp,
                middlewareResult: NotCalled.value
              }))))(function(eff) {
                return executeHandler(eff);
              })));
            };
          };
        };
      };
    };
  };
};
var handleExtRequestWithMiddleware1 = /* @__PURE__ */ handleExtRequestWithMiddleware()();
var defaultHostname = "0.0.0.0";
var serveInternal = function() {
  return function(dictFillableFields) {
    var justifill2 = justifill(fillableRecord2(dictFillableFields)()());
    return function() {
      return function() {
        return function(dictJustifiableFields) {
          var justifill1 = justifill2(justifiableRecord2(dictJustifiableFields));
          return function() {
            return function() {
              return function(dictKeysRL) {
                var keys11 = keys12(dictKeysRL);
                var handleExtRequestWithMiddleware2 = handleExtRequestWithMiddleware1(keys11)();
                var handleRequest2 = handleRequest1(keys11)();
                return function() {
                  return function(inputOptions) {
                    return function(maybeNodeMiddleware) {
                      return function(settings) {
                        var filledOptions = justifill1(inputOptions);
                        var host = fromMaybe(defaultHostname)(filledOptions.hostname);
                        var port = fromMaybe(defaultPort)(filledOptions.port);
                        var onStarted = fromMaybe(defaultOnStart(host)(port))(filledOptions.onStarted);
                        var options = {
                          host,
                          port,
                          backlog: fromMaybe(511)(filledOptions.backlog)
                        };
                        var routingSettings = merge3(settings)({
                          notFoundHandler: fromMaybe(defaultNotFoundHandler)(filledOptions.notFoundHandler)
                        });
                        var handler = function() {
                          if (maybeNodeMiddleware instanceof Just) {
                            return handleExtRequestWithMiddleware2(merge3(routingSettings)({
                              nodeMiddleware: maybeNodeMiddleware.value0
                            }));
                          }
                          ;
                          if (maybeNodeMiddleware instanceof Nothing) {
                            return handleRequest2(routingSettings);
                          }
                          ;
                          throw new Error("Failed pattern match at HTTPurple.Server (line 226, column 15 - line 228, column 47): " + [maybeNodeMiddleware.constructor.name]);
                        }();
                        var sslOptions = apply3(map10(function(v) {
                          return function(v1) {
                            return {
                              certFile: v,
                              keyFile: v1
                            };
                          };
                        })(filledOptions.certFile))(filledOptions.keyFile);
                        return function __do() {
                          var netServer = function() {
                            if (sslOptions instanceof Just) {
                              var cert$prime = readFile(sslOptions.value0.certFile)();
                              var key$prime = readFile(sslOptions.value0.keyFile)();
                              var server = createSecureServer$prime2({
                                key: [key$prime],
                                cert: [cert$prime]
                              })();
                              on_(requestH)(handler)(server)();
                              return toNetServer(server);
                            }
                            ;
                            if (sslOptions instanceof Nothing) {
                              var server = createServer();
                              on_(requestH)(handler)(server)();
                              return toNetServer(server);
                            }
                            ;
                            throw new Error("Failed pattern match at HTTPurple.Server (line 230, column 16 - line 243, column 40): " + [sslOptions.constructor.name]);
                          }();
                          on_(listeningH)(onStarted)(netServer)();
                          listenTcp2(netServer)(options)();
                          var closingHandler = close(netServer);
                          return liftEffect1(registerClosingHandler(filledOptions.closingHandler)(function(eff) {
                            return applySecond2(eff)(closingHandler);
                          }))();
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};
var serveInternal1 = /* @__PURE__ */ serveInternal();
var asExtended = /* @__PURE__ */ lcmap(profunctorFn)(/* @__PURE__ */ unwrap());
var serve = function() {
  return function(dictFillableFields) {
    var serveInternal2 = serveInternal1(dictFillableFields)()();
    return function() {
      return function() {
        return function(dictJustifiableFields) {
          var serveInternal3 = serveInternal2(dictJustifiableFields)()()(keysRLNil)();
          return function(inputOptions) {
            return function(v) {
              var extendedSettings = {
                route: v.route,
                router: asExtended(v.router)
              };
              return serveInternal3(inputOptions)(Nothing.value)(extendedSettings);
            };
          };
        };
      };
    };
  };
};

// output/Routing.Duplex.Generic.Syntax/index.js
var gsepStringRoute = function(dictGRouteDuplexCtr) {
  var gRouteDuplexCtr2 = gRouteDuplexCtr(dictGRouteDuplexCtr);
  return {
    gsep: function(a) {
      var $15 = prefix2(a);
      return function($16) {
        return $15(gRouteDuplexCtr2($16));
      };
    }
  };
};
var gsep = function(dict) {
  return dict.gsep;
};

// output/Main/index.js
var ok3 = /* @__PURE__ */ ok2(monadAffAff)(bodyString);
var Hello = /* @__PURE__ */ function() {
  function Hello2(value0) {
    this.value0 = value0;
  }
  ;
  Hello2.create = function(value0) {
    return new Hello2(value0);
  };
  return Hello2;
}();
var genericRoute_ = {
  to: function(x) {
    return new Hello(x);
  },
  from: function(x) {
    return x.value0;
  }
};
var route = /* @__PURE__ */ mkRoute(genericRoute_)(/* @__PURE__ */ gRouteConstructor({
  reflectSymbol: function() {
    return "Hello";
  }
})()(gRouteArgument))({
  Hello: /* @__PURE__ */ gsep(/* @__PURE__ */ gsepStringRoute(gRouteAll))("hello")(segment)
});
var main = /* @__PURE__ */ function() {
  var router = function(v) {
    return ok3("hello " + v.route.value0);
  };
  return serve()(fillableFieldsCons({
    reflectSymbol: function() {
      return "backlog";
    }
  })(fillableFieldsCons({
    reflectSymbol: function() {
      return "certFile";
    }
  })(fillableFieldsCons({
    reflectSymbol: function() {
      return "closingHandler";
    }
  })(fillableFieldsCons({
    reflectSymbol: function() {
      return "hostname";
    }
  })(fillableFieldsCons({
    reflectSymbol: function() {
      return "keyFile";
    }
  })(fillableFieldsCons({
    reflectSymbol: function() {
      return "notFoundHandler";
    }
  })(fillableFieldsCons({
    reflectSymbol: function() {
      return "onStarted";
    }
  })(fillableFieldsNil)()())()())()())()())()())()())()())()()(justifiableFieldsCons({
    reflectSymbol: function() {
      return "port";
    }
  })()()()(justifiableFieldsNil)(justifiableAToMaybe))({
    port: 3e3
  })({
    route,
    router
  });
}();

// <stdin>
main();
