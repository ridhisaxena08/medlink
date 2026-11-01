(function () {
  const u = document.createElement("link").relList;
  if (u && u.supports && u.supports("modulepreload")) return;
  for (const f of document.querySelectorAll('link[rel="modulepreload"]')) m(f);
  new MutationObserver((f) => {
    for (const h of f)
      if (h.type === "childList")
        for (const j of h.addedNodes)
          j.tagName === "LINK" && j.rel === "modulepreload" && m(j);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(f) {
    const h = {};
    return (
      f.integrity && (h.integrity = f.integrity),
      f.referrerPolicy && (h.referrerPolicy = f.referrerPolicy),
      f.crossOrigin === "use-credentials"
        ? (h.credentials = "include")
        : f.crossOrigin === "anonymous"
          ? (h.credentials = "omit")
          : (h.credentials = "same-origin"),
      h
    );
  }
  function m(f) {
    if (f.ep) return;
    f.ep = !0;
    const h = o(f);
    fetch(f.href, h);
  }
})();
function Ju(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default")
    ? a.default
    : a;
}
var xi = { exports: {} },
  Ur = {},
  gi = { exports: {} },
  re = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Pu;
function zp() {
  if (Pu) return re;
  Pu = 1;
  var a = Symbol.for("react.element"),
    u = Symbol.for("react.portal"),
    o = Symbol.for("react.fragment"),
    m = Symbol.for("react.strict_mode"),
    f = Symbol.for("react.profiler"),
    h = Symbol.for("react.provider"),
    j = Symbol.for("react.context"),
    y = Symbol.for("react.forward_ref"),
    g = Symbol.for("react.suspense"),
    E = Symbol.for("react.memo"),
    N = Symbol.for("react.lazy"),
    S = Symbol.iterator;
  function _(v) {
    return v === null || typeof v != "object"
      ? null
      : ((v = (S && v[S]) || v["@@iterator"]),
        typeof v == "function" ? v : null);
  }
  var R = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    $ = Object.assign,
    C = {};
  function D(v, z, ne) {
    ((this.props = v),
      (this.context = z),
      (this.refs = C),
      (this.updater = ne || R));
  }
  ((D.prototype.isReactComponent = {}),
    (D.prototype.setState = function (v, z) {
      if (typeof v != "object" && typeof v != "function" && v != null)
        throw Error(
          "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, v, z, "setState");
    }),
    (D.prototype.forceUpdate = function (v) {
      this.updater.enqueueForceUpdate(this, v, "forceUpdate");
    }));
  function Q() {}
  Q.prototype = D.prototype;
  function te(v, z, ne) {
    ((this.props = v),
      (this.context = z),
      (this.refs = C),
      (this.updater = ne || R));
  }
  var le = (te.prototype = new Q());
  ((le.constructor = te), $(le, D.prototype), (le.isPureReactComponent = !0));
  var Z = Array.isArray,
    be = Object.prototype.hasOwnProperty,
    ee = { current: null },
    G = { key: !0, ref: !0, __self: !0, __source: !0 };
  function de(v, z, ne) {
    var se,
      ie = {},
      oe = null,
      pe = null;
    if (z != null)
      for (se in (z.ref !== void 0 && (pe = z.ref),
      z.key !== void 0 && (oe = "" + z.key),
      z))
        be.call(z, se) && !G.hasOwnProperty(se) && (ie[se] = z[se]);
    var fe = arguments.length - 2;
    if (fe === 1) ie.children = ne;
    else if (1 < fe) {
      for (var ve = Array(fe), tt = 0; tt < fe; tt++)
        ve[tt] = arguments[tt + 2];
      ie.children = ve;
    }
    if (v && v.defaultProps)
      for (se in ((fe = v.defaultProps), fe))
        ie[se] === void 0 && (ie[se] = fe[se]);
    return {
      $$typeof: a,
      type: v,
      key: oe,
      ref: pe,
      props: ie,
      _owner: ee.current,
    };
  }
  function Te(v, z) {
    return {
      $$typeof: a,
      type: v.type,
      key: z,
      ref: v.ref,
      props: v.props,
      _owner: v._owner,
    };
  }
  function we(v) {
    return typeof v == "object" && v !== null && v.$$typeof === a;
  }
  function $t(v) {
    var z = { "=": "=0", ":": "=2" };
    return (
      "$" +
      v.replace(/[=:]/g, function (ne) {
        return z[ne];
      })
    );
  }
  var at = /\/+/g;
  function et(v, z) {
    return typeof v == "object" && v !== null && v.key != null
      ? $t("" + v.key)
      : z.toString(36);
  }
  function gt(v, z, ne, se, ie) {
    var oe = typeof v;
    (oe === "undefined" || oe === "boolean") && (v = null);
    var pe = !1;
    if (v === null) pe = !0;
    else
      switch (oe) {
        case "string":
        case "number":
          pe = !0;
          break;
        case "object":
          switch (v.$$typeof) {
            case a:
            case u:
              pe = !0;
          }
      }
    if (pe)
      return (
        (pe = v),
        (ie = ie(pe)),
        (v = se === "" ? "." + et(pe, 0) : se),
        Z(ie)
          ? ((ne = ""),
            v != null && (ne = v.replace(at, "$&/") + "/"),
            gt(ie, z, ne, "", function (tt) {
              return tt;
            }))
          : ie != null &&
            (we(ie) &&
              (ie = Te(
                ie,
                ne +
                  (!ie.key || (pe && pe.key === ie.key)
                    ? ""
                    : ("" + ie.key).replace(at, "$&/") + "/") +
                  v,
              )),
            z.push(ie)),
        1
      );
    if (((pe = 0), (se = se === "" ? "." : se + ":"), Z(v)))
      for (var fe = 0; fe < v.length; fe++) {
        oe = v[fe];
        var ve = se + et(oe, fe);
        pe += gt(oe, z, ne, ve, ie);
      }
    else if (((ve = _(v)), typeof ve == "function"))
      for (v = ve.call(v), fe = 0; !(oe = v.next()).done; )
        ((oe = oe.value),
          (ve = se + et(oe, fe++)),
          (pe += gt(oe, z, ne, ve, ie)));
    else if (oe === "object")
      throw (
        (z = String(v)),
        Error(
          "Objects are not valid as a React child (found: " +
            (z === "[object Object]"
              ? "object with keys {" + Object.keys(v).join(", ") + "}"
              : z) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    return pe;
  }
  function Ct(v, z, ne) {
    if (v == null) return v;
    var se = [],
      ie = 0;
    return (
      gt(v, se, "", "", function (oe) {
        return z.call(ne, oe, ie++);
      }),
      se
    );
  }
  function We(v) {
    if (v._status === -1) {
      var z = v._result;
      ((z = z()),
        z.then(
          function (ne) {
            (v._status === 0 || v._status === -1) &&
              ((v._status = 1), (v._result = ne));
          },
          function (ne) {
            (v._status === 0 || v._status === -1) &&
              ((v._status = 2), (v._result = ne));
          },
        ),
        v._status === -1 && ((v._status = 0), (v._result = z)));
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var ke = { current: null },
    O = { transition: null },
    X = {
      ReactCurrentDispatcher: ke,
      ReactCurrentBatchConfig: O,
      ReactCurrentOwner: ee,
    };
  function U() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return (
    (re.Children = {
      map: Ct,
      forEach: function (v, z, ne) {
        Ct(
          v,
          function () {
            z.apply(this, arguments);
          },
          ne,
        );
      },
      count: function (v) {
        var z = 0;
        return (
          Ct(v, function () {
            z++;
          }),
          z
        );
      },
      toArray: function (v) {
        return (
          Ct(v, function (z) {
            return z;
          }) || []
        );
      },
      only: function (v) {
        if (!we(v))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return v;
      },
    }),
    (re.Component = D),
    (re.Fragment = o),
    (re.Profiler = f),
    (re.PureComponent = te),
    (re.StrictMode = m),
    (re.Suspense = g),
    (re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = X),
    (re.act = U),
    (re.cloneElement = function (v, z, ne) {
      if (v == null)
        throw Error(
          "React.cloneElement(...): The argument must be a React element, but you passed " +
            v +
            ".",
        );
      var se = $({}, v.props),
        ie = v.key,
        oe = v.ref,
        pe = v._owner;
      if (z != null) {
        if (
          (z.ref !== void 0 && ((oe = z.ref), (pe = ee.current)),
          z.key !== void 0 && (ie = "" + z.key),
          v.type && v.type.defaultProps)
        )
          var fe = v.type.defaultProps;
        for (ve in z)
          be.call(z, ve) &&
            !G.hasOwnProperty(ve) &&
            (se[ve] = z[ve] === void 0 && fe !== void 0 ? fe[ve] : z[ve]);
      }
      var ve = arguments.length - 2;
      if (ve === 1) se.children = ne;
      else if (1 < ve) {
        fe = Array(ve);
        for (var tt = 0; tt < ve; tt++) fe[tt] = arguments[tt + 2];
        se.children = fe;
      }
      return {
        $$typeof: a,
        type: v.type,
        key: ie,
        ref: oe,
        props: se,
        _owner: pe,
      };
    }),
    (re.createContext = function (v) {
      return (
        (v = {
          $$typeof: j,
          _currentValue: v,
          _currentValue2: v,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (v.Provider = { $$typeof: h, _context: v }),
        (v.Consumer = v)
      );
    }),
    (re.createElement = de),
    (re.createFactory = function (v) {
      var z = de.bind(null, v);
      return ((z.type = v), z);
    }),
    (re.createRef = function () {
      return { current: null };
    }),
    (re.forwardRef = function (v) {
      return { $$typeof: y, render: v };
    }),
    (re.isValidElement = we),
    (re.lazy = function (v) {
      return { $$typeof: N, _payload: { _status: -1, _result: v }, _init: We };
    }),
    (re.memo = function (v, z) {
      return { $$typeof: E, type: v, compare: z === void 0 ? null : z };
    }),
    (re.startTransition = function (v) {
      var z = O.transition;
      O.transition = {};
      try {
        v();
      } finally {
        O.transition = z;
      }
    }),
    (re.unstable_act = U),
    (re.useCallback = function (v, z) {
      return ke.current.useCallback(v, z);
    }),
    (re.useContext = function (v) {
      return ke.current.useContext(v);
    }),
    (re.useDebugValue = function () {}),
    (re.useDeferredValue = function (v) {
      return ke.current.useDeferredValue(v);
    }),
    (re.useEffect = function (v, z) {
      return ke.current.useEffect(v, z);
    }),
    (re.useId = function () {
      return ke.current.useId();
    }),
    (re.useImperativeHandle = function (v, z, ne) {
      return ke.current.useImperativeHandle(v, z, ne);
    }),
    (re.useInsertionEffect = function (v, z) {
      return ke.current.useInsertionEffect(v, z);
    }),
    (re.useLayoutEffect = function (v, z) {
      return ke.current.useLayoutEffect(v, z);
    }),
    (re.useMemo = function (v, z) {
      return ke.current.useMemo(v, z);
    }),
    (re.useReducer = function (v, z, ne) {
      return ke.current.useReducer(v, z, ne);
    }),
    (re.useRef = function (v) {
      return ke.current.useRef(v);
    }),
    (re.useState = function (v) {
      return ke.current.useState(v);
    }),
    (re.useSyncExternalStore = function (v, z, ne) {
      return ke.current.useSyncExternalStore(v, z, ne);
    }),
    (re.useTransition = function () {
      return ke.current.useTransition();
    }),
    (re.version = "18.3.1"),
    re
  );
}
var Ru;
function Mi() {
  return (Ru || ((Ru = 1), (gi.exports = zp())), gi.exports);
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Au;
function Tp() {
  if (Au) return Ur;
  Au = 1;
  var a = Mi(),
    u = Symbol.for("react.element"),
    o = Symbol.for("react.fragment"),
    m = Object.prototype.hasOwnProperty,
    f = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    h = { key: !0, ref: !0, __self: !0, __source: !0 };
  function j(y, g, E) {
    var N,
      S = {},
      _ = null,
      R = null;
    (E !== void 0 && (_ = "" + E),
      g.key !== void 0 && (_ = "" + g.key),
      g.ref !== void 0 && (R = g.ref));
    for (N in g) m.call(g, N) && !h.hasOwnProperty(N) && (S[N] = g[N]);
    if (y && y.defaultProps)
      for (N in ((g = y.defaultProps), g)) S[N] === void 0 && (S[N] = g[N]);
    return {
      $$typeof: u,
      type: y,
      key: _,
      ref: R,
      props: S,
      _owner: f.current,
    };
  }
  return ((Ur.Fragment = o), (Ur.jsx = j), (Ur.jsxs = j), Ur);
}
var Du;
function Pp() {
  return (Du || ((Du = 1), (xi.exports = Tp())), xi.exports);
}
var s = Pp(),
  P = Mi();
const Rp = Ju(P);
var dl = {},
  vi = { exports: {} },
  Xe = {},
  yi = { exports: {} },
  wi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Lu;
function Ap() {
  return (
    Lu ||
      ((Lu = 1),
      (function (a) {
        function u(O, X) {
          var U = O.length;
          O.push(X);
          e: for (; 0 < U; ) {
            var v = (U - 1) >>> 1,
              z = O[v];
            if (0 < f(z, X)) ((O[v] = X), (O[U] = z), (U = v));
            else break e;
          }
        }
        function o(O) {
          return O.length === 0 ? null : O[0];
        }
        function m(O) {
          if (O.length === 0) return null;
          var X = O[0],
            U = O.pop();
          if (U !== X) {
            O[0] = U;
            e: for (var v = 0, z = O.length, ne = z >>> 1; v < ne; ) {
              var se = 2 * (v + 1) - 1,
                ie = O[se],
                oe = se + 1,
                pe = O[oe];
              if (0 > f(ie, U))
                oe < z && 0 > f(pe, ie)
                  ? ((O[v] = pe), (O[oe] = U), (v = oe))
                  : ((O[v] = ie), (O[se] = U), (v = se));
              else if (oe < z && 0 > f(pe, U))
                ((O[v] = pe), (O[oe] = U), (v = oe));
              else break e;
            }
          }
          return X;
        }
        function f(O, X) {
          var U = O.sortIndex - X.sortIndex;
          return U !== 0 ? U : O.id - X.id;
        }
        if (
          typeof performance == "object" &&
          typeof performance.now == "function"
        ) {
          var h = performance;
          a.unstable_now = function () {
            return h.now();
          };
        } else {
          var j = Date,
            y = j.now();
          a.unstable_now = function () {
            return j.now() - y;
          };
        }
        var g = [],
          E = [],
          N = 1,
          S = null,
          _ = 3,
          R = !1,
          $ = !1,
          C = !1,
          D = typeof setTimeout == "function" ? setTimeout : null,
          Q = typeof clearTimeout == "function" ? clearTimeout : null,
          te = typeof setImmediate < "u" ? setImmediate : null;
        typeof navigator < "u" &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function le(O) {
          for (var X = o(E); X !== null; ) {
            if (X.callback === null) m(E);
            else if (X.startTime <= O)
              (m(E), (X.sortIndex = X.expirationTime), u(g, X));
            else break;
            X = o(E);
          }
        }
        function Z(O) {
          if (((C = !1), le(O), !$))
            if (o(g) !== null) (($ = !0), We(be));
            else {
              var X = o(E);
              X !== null && ke(Z, X.startTime - O);
            }
        }
        function be(O, X) {
          (($ = !1), C && ((C = !1), Q(de), (de = -1)), (R = !0));
          var U = _;
          try {
            for (
              le(X), S = o(g);
              S !== null && (!(S.expirationTime > X) || (O && !$t()));
            ) {
              var v = S.callback;
              if (typeof v == "function") {
                ((S.callback = null), (_ = S.priorityLevel));
                var z = v(S.expirationTime <= X);
                ((X = a.unstable_now()),
                  typeof z == "function"
                    ? (S.callback = z)
                    : S === o(g) && m(g),
                  le(X));
              } else m(g);
              S = o(g);
            }
            if (S !== null) var ne = !0;
            else {
              var se = o(E);
              (se !== null && ke(Z, se.startTime - X), (ne = !1));
            }
            return ne;
          } finally {
            ((S = null), (_ = U), (R = !1));
          }
        }
        var ee = !1,
          G = null,
          de = -1,
          Te = 5,
          we = -1;
        function $t() {
          return !(a.unstable_now() - we < Te);
        }
        function at() {
          if (G !== null) {
            var O = a.unstable_now();
            we = O;
            var X = !0;
            try {
              X = G(!0, O);
            } finally {
              X ? et() : ((ee = !1), (G = null));
            }
          } else ee = !1;
        }
        var et;
        if (typeof te == "function")
          et = function () {
            te(at);
          };
        else if (typeof MessageChannel < "u") {
          var gt = new MessageChannel(),
            Ct = gt.port2;
          ((gt.port1.onmessage = at),
            (et = function () {
              Ct.postMessage(null);
            }));
        } else
          et = function () {
            D(at, 0);
          };
        function We(O) {
          ((G = O), ee || ((ee = !0), et()));
        }
        function ke(O, X) {
          de = D(function () {
            O(a.unstable_now());
          }, X);
        }
        ((a.unstable_IdlePriority = 5),
          (a.unstable_ImmediatePriority = 1),
          (a.unstable_LowPriority = 4),
          (a.unstable_NormalPriority = 3),
          (a.unstable_Profiling = null),
          (a.unstable_UserBlockingPriority = 2),
          (a.unstable_cancelCallback = function (O) {
            O.callback = null;
          }),
          (a.unstable_continueExecution = function () {
            $ || R || (($ = !0), We(be));
          }),
          (a.unstable_forceFrameRate = function (O) {
            0 > O || 125 < O
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (Te = 0 < O ? Math.floor(1e3 / O) : 5);
          }),
          (a.unstable_getCurrentPriorityLevel = function () {
            return _;
          }),
          (a.unstable_getFirstCallbackNode = function () {
            return o(g);
          }),
          (a.unstable_next = function (O) {
            switch (_) {
              case 1:
              case 2:
              case 3:
                var X = 3;
                break;
              default:
                X = _;
            }
            var U = _;
            _ = X;
            try {
              return O();
            } finally {
              _ = U;
            }
          }),
          (a.unstable_pauseExecution = function () {}),
          (a.unstable_requestPaint = function () {}),
          (a.unstable_runWithPriority = function (O, X) {
            switch (O) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                O = 3;
            }
            var U = _;
            _ = O;
            try {
              return X();
            } finally {
              _ = U;
            }
          }),
          (a.unstable_scheduleCallback = function (O, X, U) {
            var v = a.unstable_now();
            switch (
              (typeof U == "object" && U !== null
                ? ((U = U.delay),
                  (U = typeof U == "number" && 0 < U ? v + U : v))
                : (U = v),
              O)
            ) {
              case 1:
                var z = -1;
                break;
              case 2:
                z = 250;
                break;
              case 5:
                z = 1073741823;
                break;
              case 4:
                z = 1e4;
                break;
              default:
                z = 5e3;
            }
            return (
              (z = U + z),
              (O = {
                id: N++,
                callback: X,
                priorityLevel: O,
                startTime: U,
                expirationTime: z,
                sortIndex: -1,
              }),
              U > v
                ? ((O.sortIndex = U),
                  u(E, O),
                  o(g) === null &&
                    O === o(E) &&
                    (C ? (Q(de), (de = -1)) : (C = !0), ke(Z, U - v)))
                : ((O.sortIndex = z), u(g, O), $ || R || (($ = !0), We(be))),
              O
            );
          }),
          (a.unstable_shouldYield = $t),
          (a.unstable_wrapCallback = function (O) {
            var X = _;
            return function () {
              var U = _;
              _ = X;
              try {
                return O.apply(this, arguments);
              } finally {
                _ = U;
              }
            };
          }));
      })(wi)),
    wi
  );
}
var $u;
function Dp() {
  return ($u || (($u = 1), (yi.exports = Ap())), yi.exports);
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ou;
function Lp() {
  if (Ou) return Xe;
  Ou = 1;
  var a = Mi(),
    u = Dp();
  function o(e) {
    for (
      var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e,
        n = 1;
      n < arguments.length;
      n++
    )
      t += "&args[]=" + encodeURIComponent(arguments[n]);
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  var m = new Set(),
    f = {};
  function h(e, t) {
    (j(e, t), j(e + "Capture", t));
  }
  function j(e, t) {
    for (f[e] = t, e = 0; e < t.length; e++) m.add(t[e]);
  }
  var y = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    g = Object.prototype.hasOwnProperty,
    E =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    N = {},
    S = {};
  function _(e) {
    return g.call(S, e)
      ? !0
      : g.call(N, e)
        ? !1
        : E.test(e)
          ? (S[e] = !0)
          : ((N[e] = !0), !1);
  }
  function R(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r
          ? !1
          : n !== null
            ? !n.acceptsBooleans
            : ((e = e.toLowerCase().slice(0, 5)),
              e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function $(e, t, n, r) {
    if (t === null || typeof t > "u" || R(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null)
      switch (n.type) {
        case 3:
          return !t;
        case 4:
          return t === !1;
        case 5:
          return isNaN(t);
        case 6:
          return isNaN(t) || 1 > t;
      }
    return !1;
  }
  function C(e, t, n, r, l, i, c) {
    ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
      (this.attributeName = r),
      (this.attributeNamespace = l),
      (this.mustUseProperty = n),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = i),
      (this.removeEmptyString = c));
  }
  var D = {};
  ("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (e) {
      D[e] = new C(e, 0, !1, e, null, !1, !1);
    }),
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (e) {
      var t = e[0];
      D[t] = new C(t, 1, !1, e[1], null, !1, !1);
    }),
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(
      function (e) {
        D[e] = new C(e, 2, !1, e.toLowerCase(), null, !1, !1);
      },
    ),
    [
      "autoReverse",
      "externalResourcesRequired",
      "focusable",
      "preserveAlpha",
    ].forEach(function (e) {
      D[e] = new C(e, 2, !1, e, null, !1, !1);
    }),
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
      .split(" ")
      .forEach(function (e) {
        D[e] = new C(e, 3, !1, e.toLowerCase(), null, !1, !1);
      }),
    ["checked", "multiple", "muted", "selected"].forEach(function (e) {
      D[e] = new C(e, 3, !0, e, null, !1, !1);
    }),
    ["capture", "download"].forEach(function (e) {
      D[e] = new C(e, 4, !1, e, null, !1, !1);
    }),
    ["cols", "rows", "size", "span"].forEach(function (e) {
      D[e] = new C(e, 6, !1, e, null, !1, !1);
    }),
    ["rowSpan", "start"].forEach(function (e) {
      D[e] = new C(e, 5, !1, e.toLowerCase(), null, !1, !1);
    }));
  var Q = /[\-:]([a-z])/g;
  function te(e) {
    return e[1].toUpperCase();
  }
  ("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (e) {
      var t = e.replace(Q, te);
      D[t] = new C(t, 1, !1, e, null, !1, !1);
    }),
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
      .split(" ")
      .forEach(function (e) {
        var t = e.replace(Q, te);
        D[t] = new C(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
      }),
    ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
      var t = e.replace(Q, te);
      D[t] = new C(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }),
    ["tabIndex", "crossOrigin"].forEach(function (e) {
      D[e] = new C(e, 1, !1, e.toLowerCase(), null, !1, !1);
    }),
    (D.xlinkHref = new C(
      "xlinkHref",
      1,
      !1,
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      !1,
    )),
    ["src", "href", "action", "formAction"].forEach(function (e) {
      D[e] = new C(e, 1, !1, e.toLowerCase(), null, !0, !0);
    }));
  function le(e, t, n, r) {
    var l = D.hasOwnProperty(t) ? D[t] : null;
    (l !== null
      ? l.type !== 0
      : r ||
        !(2 < t.length) ||
        (t[0] !== "o" && t[0] !== "O") ||
        (t[1] !== "n" && t[1] !== "N")) &&
      ($(t, n, l, r) && (n = null),
      r || l === null
        ? _(t) &&
          (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
        : l.mustUseProperty
          ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
          : ((t = l.attributeName),
            (r = l.attributeNamespace),
            n === null
              ? e.removeAttribute(t)
              : ((l = l.type),
                (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
                r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var Z = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    be = Symbol.for("react.element"),
    ee = Symbol.for("react.portal"),
    G = Symbol.for("react.fragment"),
    de = Symbol.for("react.strict_mode"),
    Te = Symbol.for("react.profiler"),
    we = Symbol.for("react.provider"),
    $t = Symbol.for("react.context"),
    at = Symbol.for("react.forward_ref"),
    et = Symbol.for("react.suspense"),
    gt = Symbol.for("react.suspense_list"),
    Ct = Symbol.for("react.memo"),
    We = Symbol.for("react.lazy"),
    ke = Symbol.for("react.offscreen"),
    O = Symbol.iterator;
  function X(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (O && e[O]) || e["@@iterator"]),
        typeof e == "function" ? e : null);
  }
  var U = Object.assign,
    v;
  function z(e) {
    if (v === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        v = (t && t[1]) || "";
      }
    return (
      `
` +
      v +
      e
    );
  }
  var ne = !1;
  function se(e, t) {
    if (!e || ne) return "";
    ne = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t)
        if (
          ((t = function () {
            throw Error();
          }),
          Object.defineProperty(t.prototype, "props", {
            set: function () {
              throw Error();
            },
          }),
          typeof Reflect == "object" && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, []);
          } catch (k) {
            var r = k;
          }
          Reflect.construct(e, [], t);
        } else {
          try {
            t.call();
          } catch (k) {
            r = k;
          }
          e.call(t.prototype);
        }
      else {
        try {
          throw Error();
        } catch (k) {
          r = k;
        }
        e();
      }
    } catch (k) {
      if (k && r && typeof k.stack == "string") {
        for (
          var l = k.stack.split(`
`),
            i = r.stack.split(`
`),
            c = l.length - 1,
            d = i.length - 1;
          1 <= c && 0 <= d && l[c] !== i[d];
        )
          d--;
        for (; 1 <= c && 0 <= d; c--, d--)
          if (l[c] !== i[d]) {
            if (c !== 1 || d !== 1)
              do
                if ((c--, d--, 0 > d || l[c] !== i[d])) {
                  var p =
                    `
` + l[c].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      p.includes("<anonymous>") &&
                      (p = p.replace("<anonymous>", e.displayName)),
                    p
                  );
                }
              while (1 <= c && 0 <= d);
            break;
          }
      }
    } finally {
      ((ne = !1), (Error.prepareStackTrace = n));
    }
    return (e = e ? e.displayName || e.name : "") ? z(e) : "";
  }
  function ie(e) {
    switch (e.tag) {
      case 5:
        return z(e.type);
      case 16:
        return z("Lazy");
      case 13:
        return z("Suspense");
      case 19:
        return z("SuspenseList");
      case 0:
      case 2:
      case 15:
        return ((e = se(e.type, !1)), e);
      case 11:
        return ((e = se(e.type.render, !1)), e);
      case 1:
        return ((e = se(e.type, !0)), e);
      default:
        return "";
    }
  }
  function oe(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case G:
        return "Fragment";
      case ee:
        return "Portal";
      case Te:
        return "Profiler";
      case de:
        return "StrictMode";
      case et:
        return "Suspense";
      case gt:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case $t:
          return (e.displayName || "Context") + ".Consumer";
        case we:
          return (e._context.displayName || "Context") + ".Provider";
        case at:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case Ct:
          return (
            (t = e.displayName || null),
            t !== null ? t : oe(e.type) || "Memo"
          );
        case We:
          ((t = e._payload), (e = e._init));
          try {
            return oe(e(t));
          } catch {}
      }
    return null;
  }
  function pe(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return (
          (e = t.render),
          (e = e.displayName || e.name || ""),
          t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
        );
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return oe(t);
      case 8:
        return t === de ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function fe(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ve(e) {
    var t = e.type;
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function tt(e) {
    var t = ve(e) ? "checked" : "value",
      n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
      r = "" + e[t];
    if (
      !e.hasOwnProperty(t) &&
      typeof n < "u" &&
      typeof n.get == "function" &&
      typeof n.set == "function"
    ) {
      var l = n.get,
        i = n.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return l.call(this);
          },
          set: function (c) {
            ((r = "" + c), i.call(this, c));
          },
        }),
        Object.defineProperty(e, t, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return r;
          },
          setValue: function (c) {
            r = "" + c;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function ts(e) {
    e._valueTracker || (e._valueTracker = tt(e));
  }
  function $i(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      r = "";
    return (
      e && (r = ve(e) ? (e.checked ? "true" : "false") : e.value),
      (e = r),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  function ns(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function bl(e, t) {
    var n = t.checked;
    return U({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: n ?? e._wrapperState.initialChecked,
    });
  }
  function Oi(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue,
      r = t.checked != null ? t.checked : t.defaultChecked;
    ((n = fe(t.value != null ? t.value : n)),
      (e._wrapperState = {
        initialChecked: r,
        initialValue: n,
        controlled:
          t.type === "checkbox" || t.type === "radio"
            ? t.checked != null
            : t.value != null,
      }));
  }
  function Fi(e, t) {
    ((t = t.checked), t != null && le(e, "checked", t, !1));
  }
  function kl(e, t) {
    Fi(e, t);
    var n = fe(t.value),
      r = t.type;
    if (n != null)
      r === "number"
        ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
        : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    (t.hasOwnProperty("value")
      ? Sl(e, t.type, n)
      : t.hasOwnProperty("defaultValue") && Sl(e, t.type, fe(t.defaultValue)),
      t.checked == null &&
        t.defaultChecked != null &&
        (e.defaultChecked = !!t.defaultChecked));
  }
  function Ii(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (
        !(
          (r !== "submit" && r !== "reset") ||
          (t.value !== void 0 && t.value !== null)
        )
      )
        return;
      ((t = "" + e._wrapperState.initialValue),
        n || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((n = e.name),
      n !== "" && (e.name = ""),
      (e.defaultChecked = !!e._wrapperState.initialChecked),
      n !== "" && (e.name = n));
  }
  function Sl(e, t, n) {
    (t !== "number" || ns(e.ownerDocument) !== e) &&
      (n == null
        ? (e.defaultValue = "" + e._wrapperState.initialValue)
        : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var rr = Array.isArray;
  function zn(e, t, n, r) {
    if (((e = e.options), t)) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++)
        ((l = t.hasOwnProperty("$" + e[n].value)),
          e[n].selected !== l && (e[n].selected = l),
          l && r && (e[n].defaultSelected = !0));
    } else {
      for (n = "" + fe(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Cl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(o(91));
    return U({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: "" + e._wrapperState.initialValue,
    });
  }
  function Bi(e, t) {
    var n = t.value;
    if (n == null) {
      if (((n = t.children), (t = t.defaultValue), n != null)) {
        if (t != null) throw Error(o(92));
        if (rr(n)) {
          if (1 < n.length) throw Error(o(93));
          n = n[0];
        }
        t = n;
      }
      (t == null && (t = ""), (n = t));
    }
    e._wrapperState = { initialValue: fe(n) };
  }
  function Ui(e, t) {
    var n = fe(t.value),
      r = fe(t.defaultValue);
    (n != null &&
      ((n = "" + n),
      n !== e.value && (e.value = n),
      t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
      r != null && (e.defaultValue = "" + r));
  }
  function Vi(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue &&
      t !== "" &&
      t !== null &&
      (e.value = t);
  }
  function Hi(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function _l(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml"
      ? Hi(t)
      : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : e;
  }
  var rs,
    Wi = (function (e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
        ? function (t, n, r, l) {
            MSApp.execUnsafeLocalFunction(function () {
              return e(t, n, r, l);
            });
          }
        : e;
    })(function (e, t) {
      if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
        e.innerHTML = t;
      else {
        for (
          rs = rs || document.createElement("div"),
            rs.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
            t = rs.firstChild;
          e.firstChild;
        )
          e.removeChild(e.firstChild);
        for (; t.firstChild; ) e.appendChild(t.firstChild);
      }
    });
  function sr(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var lr = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    Af = ["Webkit", "ms", "Moz", "O"];
  Object.keys(lr).forEach(function (e) {
    Af.forEach(function (t) {
      ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (lr[t] = lr[e]));
    });
  });
  function Qi(e, t, n) {
    return t == null || typeof t == "boolean" || t === ""
      ? ""
      : n || typeof t != "number" || t === 0 || (lr.hasOwnProperty(e) && lr[e])
        ? ("" + t).trim()
        : t + "px";
  }
  function Yi(e, t) {
    e = e.style;
    for (var n in t)
      if (t.hasOwnProperty(n)) {
        var r = n.indexOf("--") === 0,
          l = Qi(n, t[n], r);
        (n === "float" && (n = "cssFloat"),
          r ? e.setProperty(n, l) : (e[n] = l));
      }
  }
  var Df = U(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    },
  );
  function El(e, t) {
    if (t) {
      if (Df[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
        throw Error(o(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(o(60));
        if (
          typeof t.dangerouslySetInnerHTML != "object" ||
          !("__html" in t.dangerouslySetInnerHTML)
        )
          throw Error(o(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(o(62));
    }
  }
  function Ml(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var zl = null;
  function Tl(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var Pl = null,
    Tn = null,
    Pn = null;
  function qi(e) {
    if ((e = _r(e))) {
      if (typeof Pl != "function") throw Error(o(280));
      var t = e.stateNode;
      t && ((t = Cs(t)), Pl(e.stateNode, e.type, t));
    }
  }
  function Ki(e) {
    Tn ? (Pn ? Pn.push(e) : (Pn = [e])) : (Tn = e);
  }
  function Gi() {
    if (Tn) {
      var e = Tn,
        t = Pn;
      if (((Pn = Tn = null), qi(e), t)) for (e = 0; e < t.length; e++) qi(t[e]);
    }
  }
  function Xi(e, t) {
    return e(t);
  }
  function Ji() {}
  var Rl = !1;
  function Zi(e, t, n) {
    if (Rl) return e(t, n);
    Rl = !0;
    try {
      return Xi(e, t, n);
    } finally {
      ((Rl = !1), (Tn !== null || Pn !== null) && (Ji(), Gi()));
    }
  }
  function ar(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Cs(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((r = !r.disabled) ||
          ((e = e.type),
          (r = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !r));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(o(231, t, typeof n));
    return n;
  }
  var Al = !1;
  if (y)
    try {
      var ir = {};
      (Object.defineProperty(ir, "passive", {
        get: function () {
          Al = !0;
        },
      }),
        window.addEventListener("test", ir, ir),
        window.removeEventListener("test", ir, ir));
    } catch {
      Al = !1;
    }
  function Lf(e, t, n, r, l, i, c, d, p) {
    var k = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, k);
    } catch (T) {
      this.onError(T);
    }
  }
  var or = !1,
    ss = null,
    ls = !1,
    Dl = null,
    $f = {
      onError: function (e) {
        ((or = !0), (ss = e));
      },
    };
  function Of(e, t, n, r, l, i, c, d, p) {
    ((or = !1), (ss = null), Lf.apply($f, arguments));
  }
  function Ff(e, t, n, r, l, i, c, d, p) {
    if ((Of.apply(this, arguments), or)) {
      if (or) {
        var k = ss;
        ((or = !1), (ss = null));
      } else throw Error(o(198));
      ls || ((ls = !0), (Dl = k));
    }
  }
  function mn(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function eo(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function to(e) {
    if (mn(e) !== e) throw Error(o(188));
  }
  function If(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = mn(e)), t === null)) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var i = l.alternate;
      if (i === null) {
        if (((r = l.return), r !== null)) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === i.child) {
        for (i = l.child; i; ) {
          if (i === n) return (to(l), e);
          if (i === r) return (to(l), t);
          i = i.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== r.return) ((n = l), (r = i));
      else {
        for (var c = !1, d = l.child; d; ) {
          if (d === n) {
            ((c = !0), (n = l), (r = i));
            break;
          }
          if (d === r) {
            ((c = !0), (r = l), (n = i));
            break;
          }
          d = d.sibling;
        }
        if (!c) {
          for (d = i.child; d; ) {
            if (d === n) {
              ((c = !0), (n = i), (r = l));
              break;
            }
            if (d === r) {
              ((c = !0), (r = i), (n = l));
              break;
            }
            d = d.sibling;
          }
          if (!c) throw Error(o(189));
        }
      }
      if (n.alternate !== r) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? e : t;
  }
  function no(e) {
    return ((e = If(e)), e !== null ? ro(e) : null);
  }
  function ro(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ro(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var so = u.unstable_scheduleCallback,
    lo = u.unstable_cancelCallback,
    Bf = u.unstable_shouldYield,
    Uf = u.unstable_requestPaint,
    Ce = u.unstable_now,
    Vf = u.unstable_getCurrentPriorityLevel,
    Ll = u.unstable_ImmediatePriority,
    ao = u.unstable_UserBlockingPriority,
    as = u.unstable_NormalPriority,
    Hf = u.unstable_LowPriority,
    io = u.unstable_IdlePriority,
    is = null,
    _t = null;
  function Wf(e) {
    if (_t && typeof _t.onCommitFiberRoot == "function")
      try {
        _t.onCommitFiberRoot(is, e, void 0, (e.current.flags & 128) === 128);
      } catch {}
  }
  var vt = Math.clz32 ? Math.clz32 : qf,
    Qf = Math.log,
    Yf = Math.LN2;
  function qf(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((Qf(e) / Yf) | 0)) | 0);
  }
  var os = 64,
    cs = 4194304;
  function cr(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function us(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0,
      l = e.suspendedLanes,
      i = e.pingedLanes,
      c = n & 268435455;
    if (c !== 0) {
      var d = c & ~l;
      d !== 0 ? (r = cr(d)) : ((i &= c), i !== 0 && (r = cr(i)));
    } else ((c = n & ~l), c !== 0 ? (r = cr(c)) : i !== 0 && (r = cr(i)));
    if (r === 0) return 0;
    if (
      t !== 0 &&
      t !== r &&
      (t & l) === 0 &&
      ((l = r & -r), (i = t & -t), l >= i || (l === 16 && (i & 4194240) !== 0))
    )
      return t;
    if (((r & 4) !== 0 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
      for (e = e.entanglements, t &= r; 0 < t; )
        ((n = 31 - vt(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
    return r;
  }
  function Kf(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Gf(e, t) {
    for (
      var n = e.suspendedLanes,
        r = e.pingedLanes,
        l = e.expirationTimes,
        i = e.pendingLanes;
      0 < i;
    ) {
      var c = 31 - vt(i),
        d = 1 << c,
        p = l[c];
      (p === -1
        ? ((d & n) === 0 || (d & r) !== 0) && (l[c] = Kf(d, t))
        : p <= t && (e.expiredLanes |= d),
        (i &= ~d));
    }
  }
  function $l(e) {
    return (
      (e = e.pendingLanes & -1073741825),
      e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
    );
  }
  function oo() {
    var e = os;
    return ((os <<= 1), (os & 4194240) === 0 && (os = 64), e);
  }
  function Ol(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function ur(e, t, n) {
    ((e.pendingLanes |= t),
      t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
      (e = e.eventTimes),
      (t = 31 - vt(t)),
      (e[t] = n));
  }
  function Xf(e, t) {
    var n = e.pendingLanes & ~t;
    ((e.pendingLanes = t),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.expiredLanes &= t),
      (e.mutableReadLanes &= t),
      (e.entangledLanes &= t),
      (t = e.entanglements));
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - vt(n),
        i = 1 << l;
      ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i));
    }
  }
  function Fl(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var r = 31 - vt(n),
        l = 1 << r;
      ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
    }
  }
  var me = 0;
  function co(e) {
    return (
      (e &= -e),
      1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1
    );
  }
  var uo,
    Il,
    fo,
    mo,
    po,
    Bl = !1,
    ds = [],
    Qt = null,
    Yt = null,
    qt = null,
    dr = new Map(),
    fr = new Map(),
    Kt = [],
    Jf =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
        " ",
      );
  function ho(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Qt = null;
        break;
      case "dragenter":
      case "dragleave":
        Yt = null;
        break;
      case "mouseover":
      case "mouseout":
        qt = null;
        break;
      case "pointerover":
      case "pointerout":
        dr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        fr.delete(t.pointerId);
    }
  }
  function mr(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: r,
          nativeEvent: i,
          targetContainers: [l],
        }),
        t !== null && ((t = _r(t)), t !== null && Il(t)),
        e)
      : ((e.eventSystemFlags |= r),
        (t = e.targetContainers),
        l !== null && t.indexOf(l) === -1 && t.push(l),
        e);
  }
  function Zf(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return ((Qt = mr(Qt, e, t, n, r, l)), !0);
      case "dragenter":
        return ((Yt = mr(Yt, e, t, n, r, l)), !0);
      case "mouseover":
        return ((qt = mr(qt, e, t, n, r, l)), !0);
      case "pointerover":
        var i = l.pointerId;
        return (dr.set(i, mr(dr.get(i) || null, e, t, n, r, l)), !0);
      case "gotpointercapture":
        return (
          (i = l.pointerId),
          fr.set(i, mr(fr.get(i) || null, e, t, n, r, l)),
          !0
        );
    }
    return !1;
  }
  function xo(e) {
    var t = pn(e.target);
    if (t !== null) {
      var n = mn(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = eo(n)), t !== null)) {
            ((e.blockedOn = t),
              po(e.priority, function () {
                fo(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function fs(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Vl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ((zl = r), n.target.dispatchEvent(r), (zl = null));
      } else return ((t = _r(n)), t !== null && Il(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function go(e, t, n) {
    fs(e) && n.delete(t);
  }
  function em() {
    ((Bl = !1),
      Qt !== null && fs(Qt) && (Qt = null),
      Yt !== null && fs(Yt) && (Yt = null),
      qt !== null && fs(qt) && (qt = null),
      dr.forEach(go),
      fr.forEach(go));
  }
  function pr(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      Bl ||
        ((Bl = !0),
        u.unstable_scheduleCallback(u.unstable_NormalPriority, em)));
  }
  function hr(e) {
    function t(l) {
      return pr(l, e);
    }
    if (0 < ds.length) {
      pr(ds[0], e);
      for (var n = 1; n < ds.length; n++) {
        var r = ds[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (
      Qt !== null && pr(Qt, e),
        Yt !== null && pr(Yt, e),
        qt !== null && pr(qt, e),
        dr.forEach(t),
        fr.forEach(t),
        n = 0;
      n < Kt.length;
      n++
    )
      ((r = Kt[n]), r.blockedOn === e && (r.blockedOn = null));
    for (; 0 < Kt.length && ((n = Kt[0]), n.blockedOn === null); )
      (xo(n), n.blockedOn === null && Kt.shift());
  }
  var Rn = Z.ReactCurrentBatchConfig,
    ms = !0;
  function tm(e, t, n, r) {
    var l = me,
      i = Rn.transition;
    Rn.transition = null;
    try {
      ((me = 1), Ul(e, t, n, r));
    } finally {
      ((me = l), (Rn.transition = i));
    }
  }
  function nm(e, t, n, r) {
    var l = me,
      i = Rn.transition;
    Rn.transition = null;
    try {
      ((me = 4), Ul(e, t, n, r));
    } finally {
      ((me = l), (Rn.transition = i));
    }
  }
  function Ul(e, t, n, r) {
    if (ms) {
      var l = Vl(e, t, n, r);
      if (l === null) (aa(e, t, r, ps, n), ho(e, r));
      else if (Zf(l, e, t, n, r)) r.stopPropagation();
      else if ((ho(e, r), t & 4 && -1 < Jf.indexOf(e))) {
        for (; l !== null; ) {
          var i = _r(l);
          if (
            (i !== null && uo(i),
            (i = Vl(e, t, n, r)),
            i === null && aa(e, t, r, ps, n),
            i === l)
          )
            break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else aa(e, t, r, null, n);
    }
  }
  var ps = null;
  function Vl(e, t, n, r) {
    if (((ps = null), (e = Tl(r)), (e = pn(e)), e !== null))
      if (((t = mn(e)), t === null)) e = null;
      else if (((n = t.tag), n === 13)) {
        if (((e = eo(t)), e !== null)) return e;
        e = null;
      } else if (n === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return t.tag === 3 ? t.stateNode.containerInfo : null;
        e = null;
      } else t !== e && (e = null);
    return ((ps = e), null);
  }
  function vo(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Vf()) {
          case Ll:
            return 1;
          case ao:
            return 4;
          case as:
          case Hf:
            return 16;
          case io:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Gt = null,
    Hl = null,
    hs = null;
  function yo() {
    if (hs) return hs;
    var e,
      t = Hl,
      n = t.length,
      r,
      l = "value" in Gt ? Gt.value : Gt.textContent,
      i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++);
    var c = n - e;
    for (r = 1; r <= c && t[n - r] === l[i - r]; r++);
    return (hs = l.slice(e, 1 < r ? 1 - r : void 0));
  }
  function xs(e) {
    var t = e.keyCode;
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
        : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function gs() {
    return !0;
  }
  function wo() {
    return !1;
  }
  function nt(e) {
    function t(n, r, l, i, c) {
      ((this._reactName = n),
        (this._targetInst = l),
        (this.type = r),
        (this.nativeEvent = i),
        (this.target = c),
        (this.currentTarget = null));
      for (var d in e)
        e.hasOwnProperty(d) && ((n = e[d]), (this[d] = n ? n(i) : i[d]));
      return (
        (this.isDefaultPrevented = (
          i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
        )
          ? gs
          : wo),
        (this.isPropagationStopped = wo),
        this
      );
    }
    return (
      U(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = gs));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = gs));
        },
        persist: function () {},
        isPersistent: gs,
      }),
      t
    );
  }
  var An = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Wl = nt(An),
    xr = U({}, An, { view: 0, detail: 0 }),
    rm = nt(xr),
    Ql,
    Yl,
    gr,
    vs = U({}, xr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Kl,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== gr &&
              (gr && e.type === "mousemove"
                ? ((Ql = e.screenX - gr.screenX), (Yl = e.screenY - gr.screenY))
                : (Yl = Ql = 0),
              (gr = e)),
            Ql);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : Yl;
      },
    }),
    jo = nt(vs),
    sm = U({}, vs, { dataTransfer: 0 }),
    lm = nt(sm),
    am = U({}, xr, { relatedTarget: 0 }),
    ql = nt(am),
    im = U({}, An, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    om = nt(im),
    cm = U({}, An, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    um = nt(cm),
    dm = U({}, An, { data: 0 }),
    No = nt(dm),
    fm = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    mm = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    pm = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function hm(e) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(e)
      : (e = pm[e])
        ? !!t[e]
        : !1;
  }
  function Kl() {
    return hm;
  }
  var xm = U({}, xr, {
      key: function (e) {
        if (e.key) {
          var t = fm[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = xs(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? mm[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Kl,
      charCode: function (e) {
        return e.type === "keypress" ? xs(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? xs(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    gm = nt(xm),
    vm = U({}, vs, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    bo = nt(vm),
    ym = U({}, xr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Kl,
    }),
    wm = nt(ym),
    jm = U({}, An, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Nm = nt(jm),
    bm = U({}, vs, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
            ? -e.wheelDeltaX
            : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    km = nt(bm),
    Sm = [9, 13, 27, 32],
    Gl = y && "CompositionEvent" in window,
    vr = null;
  y && "documentMode" in document && (vr = document.documentMode);
  var Cm = y && "TextEvent" in window && !vr,
    ko = y && (!Gl || (vr && 8 < vr && 11 >= vr)),
    So = " ",
    Co = !1;
  function _o(e, t) {
    switch (e) {
      case "keyup":
        return Sm.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Eo(e) {
    return (
      (e = e.detail),
      typeof e == "object" && "data" in e ? e.data : null
    );
  }
  var Dn = !1;
  function _m(e, t) {
    switch (e) {
      case "compositionend":
        return Eo(t);
      case "keypress":
        return t.which !== 32 ? null : ((Co = !0), So);
      case "textInput":
        return ((e = t.data), e === So && Co ? null : e);
      default:
        return null;
    }
  }
  function Em(e, t) {
    if (Dn)
      return e === "compositionend" || (!Gl && _o(e, t))
        ? ((e = yo()), (hs = Hl = Gt = null), (Dn = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return ko && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Mm = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Mo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Mm[e.type] : t === "textarea";
  }
  function zo(e, t, n, r) {
    (Ki(r),
      (t = bs(t, "onChange")),
      0 < t.length &&
        ((n = new Wl("onChange", "change", null, n, r)),
        e.push({ event: n, listeners: t })));
  }
  var yr = null,
    wr = null;
  function zm(e) {
    qo(e, 0);
  }
  function ys(e) {
    var t = In(e);
    if ($i(t)) return e;
  }
  function Tm(e, t) {
    if (e === "change") return t;
  }
  var To = !1;
  if (y) {
    var Xl;
    if (y) {
      var Jl = "oninput" in document;
      if (!Jl) {
        var Po = document.createElement("div");
        (Po.setAttribute("oninput", "return;"),
          (Jl = typeof Po.oninput == "function"));
      }
      Xl = Jl;
    } else Xl = !1;
    To = Xl && (!document.documentMode || 9 < document.documentMode);
  }
  function Ro() {
    yr && (yr.detachEvent("onpropertychange", Ao), (wr = yr = null));
  }
  function Ao(e) {
    if (e.propertyName === "value" && ys(wr)) {
      var t = [];
      (zo(t, wr, e, Tl(e)), Zi(zm, t));
    }
  }
  function Pm(e, t, n) {
    e === "focusin"
      ? (Ro(), (yr = t), (wr = n), yr.attachEvent("onpropertychange", Ao))
      : e === "focusout" && Ro();
  }
  function Rm(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return ys(wr);
  }
  function Am(e, t) {
    if (e === "click") return ys(t);
  }
  function Dm(e, t) {
    if (e === "input" || e === "change") return ys(t);
  }
  function Lm(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var yt = typeof Object.is == "function" ? Object.is : Lm;
  function jr(e, t) {
    if (yt(e, t)) return !0;
    if (
      typeof e != "object" ||
      e === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var n = Object.keys(e),
      r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!g.call(t, l) || !yt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Do(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Lo(e, t) {
    var n = Do(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (((r = e + n.textContent.length), e <= t && r >= t))
          return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Do(n);
    }
  }
  function $o(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? $o(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Oo() {
    for (var e = window, t = ns(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ns(e.document);
    }
    return t;
  }
  function Zl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  function $m(e) {
    var t = Oo(),
      n = e.focusedElem,
      r = e.selectionRange;
    if (
      t !== n &&
      n &&
      n.ownerDocument &&
      $o(n.ownerDocument.documentElement, n)
    ) {
      if (r !== null && Zl(n)) {
        if (
          ((t = r.start),
          (e = r.end),
          e === void 0 && (e = t),
          "selectionStart" in n)
        )
          ((n.selectionStart = t),
            (n.selectionEnd = Math.min(e, n.value.length)));
        else if (
          ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
          e.getSelection)
        ) {
          e = e.getSelection();
          var l = n.textContent.length,
            i = Math.min(r.start, l);
          ((r = r.end === void 0 ? i : Math.min(r.end, l)),
            !e.extend && i > r && ((l = r), (r = i), (i = l)),
            (l = Lo(n, i)));
          var c = Lo(n, r);
          l &&
            c &&
            (e.rangeCount !== 1 ||
              e.anchorNode !== l.node ||
              e.anchorOffset !== l.offset ||
              e.focusNode !== c.node ||
              e.focusOffset !== c.offset) &&
            ((t = t.createRange()),
            t.setStart(l.node, l.offset),
            e.removeAllRanges(),
            i > r
              ? (e.addRange(t), e.extend(c.node, c.offset))
              : (t.setEnd(c.node, c.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; (e = e.parentNode); )
        e.nodeType === 1 &&
          t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
        ((e = t[n]),
          (e.element.scrollLeft = e.left),
          (e.element.scrollTop = e.top));
    }
  }
  var Om = y && "documentMode" in document && 11 >= document.documentMode,
    Ln = null,
    ea = null,
    Nr = null,
    ta = !1;
  function Fo(e, t, n) {
    var r =
      n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    ta ||
      Ln == null ||
      Ln !== ns(r) ||
      ((r = Ln),
      "selectionStart" in r && Zl(r)
        ? (r = { start: r.selectionStart, end: r.selectionEnd })
        : ((r = (
            (r.ownerDocument && r.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (r = {
            anchorNode: r.anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset,
          })),
      (Nr && jr(Nr, r)) ||
        ((Nr = r),
        (r = bs(ea, "onSelect")),
        0 < r.length &&
          ((t = new Wl("onSelect", "select", null, t, n)),
          e.push({ event: t, listeners: r }),
          (t.target = Ln))));
  }
  function ws(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n["Webkit" + e] = "webkit" + t),
      (n["Moz" + e] = "moz" + t),
      n
    );
  }
  var $n = {
      animationend: ws("Animation", "AnimationEnd"),
      animationiteration: ws("Animation", "AnimationIteration"),
      animationstart: ws("Animation", "AnimationStart"),
      transitionend: ws("Transition", "TransitionEnd"),
    },
    na = {},
    Io = {};
  y &&
    ((Io = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete $n.animationend.animation,
      delete $n.animationiteration.animation,
      delete $n.animationstart.animation),
    "TransitionEvent" in window || delete $n.transitionend.transition);
  function js(e) {
    if (na[e]) return na[e];
    if (!$n[e]) return e;
    var t = $n[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in Io) return (na[e] = t[n]);
    return e;
  }
  var Bo = js("animationend"),
    Uo = js("animationiteration"),
    Vo = js("animationstart"),
    Ho = js("transitionend"),
    Wo = new Map(),
    Qo =
      "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  function Xt(e, t) {
    (Wo.set(e, t), h(t, [e]));
  }
  for (var ra = 0; ra < Qo.length; ra++) {
    var sa = Qo[ra],
      Fm = sa.toLowerCase(),
      Im = sa[0].toUpperCase() + sa.slice(1);
    Xt(Fm, "on" + Im);
  }
  (Xt(Bo, "onAnimationEnd"),
    Xt(Uo, "onAnimationIteration"),
    Xt(Vo, "onAnimationStart"),
    Xt("dblclick", "onDoubleClick"),
    Xt("focusin", "onFocus"),
    Xt("focusout", "onBlur"),
    Xt(Ho, "onTransitionEnd"),
    j("onMouseEnter", ["mouseout", "mouseover"]),
    j("onMouseLeave", ["mouseout", "mouseover"]),
    j("onPointerEnter", ["pointerout", "pointerover"]),
    j("onPointerLeave", ["pointerout", "pointerover"]),
    h(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    h(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    h("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    h(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    h(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    h(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var br =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    Bm = new Set(
      "cancel close invalid load scroll toggle".split(" ").concat(br),
    );
  function Yo(e, t, n) {
    var r = e.type || "unknown-event";
    ((e.currentTarget = n), Ff(r, t, void 0, e), (e.currentTarget = null));
  }
  function qo(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n],
        l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var c = r.length - 1; 0 <= c; c--) {
            var d = r[c],
              p = d.instance,
              k = d.currentTarget;
            if (((d = d.listener), p !== i && l.isPropagationStopped()))
              break e;
            (Yo(l, d, k), (i = p));
          }
        else
          for (c = 0; c < r.length; c++) {
            if (
              ((d = r[c]),
              (p = d.instance),
              (k = d.currentTarget),
              (d = d.listener),
              p !== i && l.isPropagationStopped())
            )
              break e;
            (Yo(l, d, k), (i = p));
          }
      }
    }
    if (ls) throw ((e = Dl), (ls = !1), (Dl = null), e);
  }
  function xe(e, t) {
    var n = t[fa];
    n === void 0 && (n = t[fa] = new Set());
    var r = e + "__bubble";
    n.has(r) || (Ko(t, e, 2, !1), n.add(r));
  }
  function la(e, t, n) {
    var r = 0;
    (t && (r |= 4), Ko(n, e, r, t));
  }
  var Ns = "_reactListening" + Math.random().toString(36).slice(2);
  function kr(e) {
    if (!e[Ns]) {
      ((e[Ns] = !0),
        m.forEach(function (n) {
          n !== "selectionchange" && (Bm.has(n) || la(n, !1, e), la(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ns] || ((t[Ns] = !0), la("selectionchange", !1, t));
    }
  }
  function Ko(e, t, n, r) {
    switch (vo(t)) {
      case 1:
        var l = tm;
        break;
      case 4:
        l = nm;
        break;
      default:
        l = Ul;
    }
    ((n = l.bind(null, t, n, e)),
      (l = void 0),
      !Al ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (l = !0),
      r
        ? l !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: l })
          : e.addEventListener(t, n, !0)
        : l !== void 0
          ? e.addEventListener(t, n, { passive: l })
          : e.addEventListener(t, n, !1));
  }
  function aa(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
      e: for (;;) {
        if (r === null) return;
        var c = r.tag;
        if (c === 3 || c === 4) {
          var d = r.stateNode.containerInfo;
          if (d === l || (d.nodeType === 8 && d.parentNode === l)) break;
          if (c === 4)
            for (c = r.return; c !== null; ) {
              var p = c.tag;
              if (
                (p === 3 || p === 4) &&
                ((p = c.stateNode.containerInfo),
                p === l || (p.nodeType === 8 && p.parentNode === l))
              )
                return;
              c = c.return;
            }
          for (; d !== null; ) {
            if (((c = pn(d)), c === null)) return;
            if (((p = c.tag), p === 5 || p === 6)) {
              r = i = c;
              continue e;
            }
            d = d.parentNode;
          }
        }
        r = r.return;
      }
    Zi(function () {
      var k = i,
        T = Tl(n),
        A = [];
      e: {
        var M = Wo.get(e);
        if (M !== void 0) {
          var F = Wl,
            V = e;
          switch (e) {
            case "keypress":
              if (xs(n) === 0) break e;
            case "keydown":
            case "keyup":
              F = gm;
              break;
            case "focusin":
              ((V = "focus"), (F = ql));
              break;
            case "focusout":
              ((V = "blur"), (F = ql));
              break;
            case "beforeblur":
            case "afterblur":
              F = ql;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              F = jo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              F = lm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              F = wm;
              break;
            case Bo:
            case Uo:
            case Vo:
              F = om;
              break;
            case Ho:
              F = Nm;
              break;
            case "scroll":
              F = rm;
              break;
            case "wheel":
              F = km;
              break;
            case "copy":
            case "cut":
            case "paste":
              F = um;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              F = bo;
          }
          var H = (t & 4) !== 0,
            _e = !H && e === "scroll",
            w = H ? (M !== null ? M + "Capture" : null) : M;
          H = [];
          for (var x = k, b; x !== null; ) {
            b = x;
            var L = b.stateNode;
            if (
              (b.tag === 5 &&
                L !== null &&
                ((b = L),
                w !== null &&
                  ((L = ar(x, w)), L != null && H.push(Sr(x, L, b)))),
              _e)
            )
              break;
            x = x.return;
          }
          0 < H.length &&
            ((M = new F(M, V, null, n, T)), A.push({ event: M, listeners: H }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((M = e === "mouseover" || e === "pointerover"),
            (F = e === "mouseout" || e === "pointerout"),
            M &&
              n !== zl &&
              (V = n.relatedTarget || n.fromElement) &&
              (pn(V) || V[Ot]))
          )
            break e;
          if (
            (F || M) &&
            ((M =
              T.window === T
                ? T
                : (M = T.ownerDocument)
                  ? M.defaultView || M.parentWindow
                  : window),
            F
              ? ((V = n.relatedTarget || n.toElement),
                (F = k),
                (V = V ? pn(V) : null),
                V !== null &&
                  ((_e = mn(V)), V !== _e || (V.tag !== 5 && V.tag !== 6)) &&
                  (V = null))
              : ((F = null), (V = k)),
            F !== V)
          ) {
            if (
              ((H = jo),
              (L = "onMouseLeave"),
              (w = "onMouseEnter"),
              (x = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((H = bo),
                (L = "onPointerLeave"),
                (w = "onPointerEnter"),
                (x = "pointer")),
              (_e = F == null ? M : In(F)),
              (b = V == null ? M : In(V)),
              (M = new H(L, x + "leave", F, n, T)),
              (M.target = _e),
              (M.relatedTarget = b),
              (L = null),
              pn(T) === k &&
                ((H = new H(w, x + "enter", V, n, T)),
                (H.target = b),
                (H.relatedTarget = _e),
                (L = H)),
              (_e = L),
              F && V)
            )
              t: {
                for (H = F, w = V, x = 0, b = H; b; b = On(b)) x++;
                for (b = 0, L = w; L; L = On(L)) b++;
                for (; 0 < x - b; ) ((H = On(H)), x--);
                for (; 0 < b - x; ) ((w = On(w)), b--);
                for (; x--; ) {
                  if (H === w || (w !== null && H === w.alternate)) break t;
                  ((H = On(H)), (w = On(w)));
                }
                H = null;
              }
            else H = null;
            (F !== null && Go(A, M, F, H, !1),
              V !== null && _e !== null && Go(A, _e, V, H, !0));
          }
        }
        e: {
          if (
            ((M = k ? In(k) : window),
            (F = M.nodeName && M.nodeName.toLowerCase()),
            F === "select" || (F === "input" && M.type === "file"))
          )
            var W = Tm;
          else if (Mo(M))
            if (To) W = Dm;
            else {
              W = Rm;
              var Y = Pm;
            }
          else
            (F = M.nodeName) &&
              F.toLowerCase() === "input" &&
              (M.type === "checkbox" || M.type === "radio") &&
              (W = Am);
          if (W && (W = W(e, k))) {
            zo(A, W, n, T);
            break e;
          }
          (Y && Y(e, M, k),
            e === "focusout" &&
              (Y = M._wrapperState) &&
              Y.controlled &&
              M.type === "number" &&
              Sl(M, "number", M.value));
        }
        switch (((Y = k ? In(k) : window), e)) {
          case "focusin":
            (Mo(Y) || Y.contentEditable === "true") &&
              ((Ln = Y), (ea = k), (Nr = null));
            break;
          case "focusout":
            Nr = ea = Ln = null;
            break;
          case "mousedown":
            ta = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((ta = !1), Fo(A, n, T));
            break;
          case "selectionchange":
            if (Om) break;
          case "keydown":
          case "keyup":
            Fo(A, n, T);
        }
        var q;
        if (Gl)
          e: {
            switch (e) {
              case "compositionstart":
                var J = "onCompositionStart";
                break e;
              case "compositionend":
                J = "onCompositionEnd";
                break e;
              case "compositionupdate":
                J = "onCompositionUpdate";
                break e;
            }
            J = void 0;
          }
        else
          Dn
            ? _o(e, n) && (J = "onCompositionEnd")
            : e === "keydown" &&
              n.keyCode === 229 &&
              (J = "onCompositionStart");
        (J &&
          (ko &&
            n.locale !== "ko" &&
            (Dn || J !== "onCompositionStart"
              ? J === "onCompositionEnd" && Dn && (q = yo())
              : ((Gt = T),
                (Hl = "value" in Gt ? Gt.value : Gt.textContent),
                (Dn = !0))),
          (Y = bs(k, J)),
          0 < Y.length &&
            ((J = new No(J, e, null, n, T)),
            A.push({ event: J, listeners: Y }),
            q ? (J.data = q) : ((q = Eo(n)), q !== null && (J.data = q)))),
          (q = Cm ? _m(e, n) : Em(e, n)) &&
            ((k = bs(k, "onBeforeInput")),
            0 < k.length &&
              ((T = new No("onBeforeInput", "beforeinput", null, n, T)),
              A.push({ event: T, listeners: k }),
              (T.data = q))));
      }
      qo(A, t);
    });
  }
  function Sr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function bs(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e,
        i = l.stateNode;
      (l.tag === 5 &&
        i !== null &&
        ((l = i),
        (i = ar(e, n)),
        i != null && r.unshift(Sr(e, i, l)),
        (i = ar(e, t)),
        i != null && r.push(Sr(e, i, l))),
        (e = e.return));
    }
    return r;
  }
  function On(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Go(e, t, n, r, l) {
    for (var i = t._reactName, c = []; n !== null && n !== r; ) {
      var d = n,
        p = d.alternate,
        k = d.stateNode;
      if (p !== null && p === r) break;
      (d.tag === 5 &&
        k !== null &&
        ((d = k),
        l
          ? ((p = ar(n, i)), p != null && c.unshift(Sr(n, p, d)))
          : l || ((p = ar(n, i)), p != null && c.push(Sr(n, p, d)))),
        (n = n.return));
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Um = /\r\n?/g,
    Vm = /\u0000|\uFFFD/g;
  function Xo(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Um,
        `
`,
      )
      .replace(Vm, "");
  }
  function ks(e, t, n) {
    if (((t = Xo(t)), Xo(e) !== t && n)) throw Error(o(425));
  }
  function Ss() {}
  var ia = null,
    oa = null;
  function ca(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var ua = typeof setTimeout == "function" ? setTimeout : void 0,
    Hm = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Jo = typeof Promise == "function" ? Promise : void 0,
    Wm =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Jo < "u"
          ? function (e) {
              return Jo.resolve(null).then(e).catch(Qm);
            }
          : ua;
  function Qm(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function da(e, t) {
    var n = t,
      r = 0;
    do {
      var l = n.nextSibling;
      if ((e.removeChild(n), l && l.nodeType === 8))
        if (((n = l.data), n === "/$")) {
          if (r === 0) {
            (e.removeChild(l), hr(t));
            return;
          }
          r--;
        } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
      n = l;
    } while (n);
    hr(t);
  }
  function Jt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function Zo(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Fn = Math.random().toString(36).slice(2),
    Et = "__reactFiber$" + Fn,
    Cr = "__reactProps$" + Fn,
    Ot = "__reactContainer$" + Fn,
    fa = "__reactEvents$" + Fn,
    Ym = "__reactListeners$" + Fn,
    qm = "__reactHandles$" + Fn;
  function pn(e) {
    var t = e[Et];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[Ot] || n[Et])) {
        if (
          ((n = t.alternate),
          t.child !== null || (n !== null && n.child !== null))
        )
          for (e = Zo(e); e !== null; ) {
            if ((n = e[Et])) return n;
            e = Zo(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function _r(e) {
    return (
      (e = e[Et] || e[Ot]),
      !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3)
        ? null
        : e
    );
  }
  function In(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(o(33));
  }
  function Cs(e) {
    return e[Cr] || null;
  }
  var ma = [],
    Bn = -1;
  function Zt(e) {
    return { current: e };
  }
  function ge(e) {
    0 > Bn || ((e.current = ma[Bn]), (ma[Bn] = null), Bn--);
  }
  function he(e, t) {
    (Bn++, (ma[Bn] = e.current), (e.current = t));
  }
  var en = {},
    Oe = Zt(en),
    Qe = Zt(!1),
    hn = en;
  function Un(e, t) {
    var n = e.type.contextTypes;
    if (!n) return en;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
      return r.__reactInternalMemoizedMaskedChildContext;
    var l = {},
      i;
    for (i in n) l[i] = t[i];
    return (
      r &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = t),
        (e.__reactInternalMemoizedMaskedChildContext = l)),
      l
    );
  }
  function Ye(e) {
    return ((e = e.childContextTypes), e != null);
  }
  function _s() {
    (ge(Qe), ge(Oe));
  }
  function ec(e, t, n) {
    if (Oe.current !== en) throw Error(o(168));
    (he(Oe, t), he(Qe, n));
  }
  function tc(e, t, n) {
    var r = e.stateNode;
    if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
      return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(o(108, pe(e) || "Unknown", l));
    return U({}, n, r);
  }
  function Es(e) {
    return (
      (e =
        ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) ||
        en),
      (hn = Oe.current),
      he(Oe, e),
      he(Qe, Qe.current),
      !0
    );
  }
  function nc(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(o(169));
    (n
      ? ((e = tc(e, t, hn)),
        (r.__reactInternalMemoizedMergedChildContext = e),
        ge(Qe),
        ge(Oe),
        he(Oe, e))
      : ge(Qe),
      he(Qe, n));
  }
  var Ft = null,
    Ms = !1,
    pa = !1;
  function rc(e) {
    Ft === null ? (Ft = [e]) : Ft.push(e);
  }
  function Km(e) {
    ((Ms = !0), rc(e));
  }
  function tn() {
    if (!pa && Ft !== null) {
      pa = !0;
      var e = 0,
        t = me;
      try {
        var n = Ft;
        for (me = 1; e < n.length; e++) {
          var r = n[e];
          do r = r(!0);
          while (r !== null);
        }
        ((Ft = null), (Ms = !1));
      } catch (l) {
        throw (Ft !== null && (Ft = Ft.slice(e + 1)), so(Ll, tn), l);
      } finally {
        ((me = t), (pa = !1));
      }
    }
    return null;
  }
  var Vn = [],
    Hn = 0,
    zs = null,
    Ts = 0,
    it = [],
    ot = 0,
    xn = null,
    It = 1,
    Bt = "";
  function gn(e, t) {
    ((Vn[Hn++] = Ts), (Vn[Hn++] = zs), (zs = e), (Ts = t));
  }
  function sc(e, t, n) {
    ((it[ot++] = It), (it[ot++] = Bt), (it[ot++] = xn), (xn = e));
    var r = It;
    e = Bt;
    var l = 32 - vt(r) - 1;
    ((r &= ~(1 << l)), (n += 1));
    var i = 32 - vt(t) + l;
    if (30 < i) {
      var c = l - (l % 5);
      ((i = (r & ((1 << c) - 1)).toString(32)),
        (r >>= c),
        (l -= c),
        (It = (1 << (32 - vt(t) + l)) | (n << l) | r),
        (Bt = i + e));
    } else ((It = (1 << i) | (n << l) | r), (Bt = e));
  }
  function ha(e) {
    e.return !== null && (gn(e, 1), sc(e, 1, 0));
  }
  function xa(e) {
    for (; e === zs; )
      ((zs = Vn[--Hn]), (Vn[Hn] = null), (Ts = Vn[--Hn]), (Vn[Hn] = null));
    for (; e === xn; )
      ((xn = it[--ot]),
        (it[ot] = null),
        (Bt = it[--ot]),
        (it[ot] = null),
        (It = it[--ot]),
        (it[ot] = null));
  }
  var rt = null,
    st = null,
    ye = !1,
    wt = null;
  function lc(e, t) {
    var n = ft(5, null, null, 0);
    ((n.elementType = "DELETED"),
      (n.stateNode = t),
      (n.return = e),
      (t = e.deletions),
      t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
  }
  function ac(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return (
          (t =
            t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
              ? null
              : t),
          t !== null
            ? ((e.stateNode = t), (rt = e), (st = Jt(t.firstChild)), !0)
            : !1
        );
      case 6:
        return (
          (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
          t !== null ? ((e.stateNode = t), (rt = e), (st = null), !0) : !1
        );
      case 13:
        return (
          (t = t.nodeType !== 8 ? null : t),
          t !== null
            ? ((n = xn !== null ? { id: It, overflow: Bt } : null),
              (e.memoizedState = {
                dehydrated: t,
                treeContext: n,
                retryLane: 1073741824,
              }),
              (n = ft(18, null, null, 0)),
              (n.stateNode = t),
              (n.return = e),
              (e.child = n),
              (rt = e),
              (st = null),
              !0)
            : !1
        );
      default:
        return !1;
    }
  }
  function ga(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function va(e) {
    if (ye) {
      var t = st;
      if (t) {
        var n = t;
        if (!ac(e, t)) {
          if (ga(e)) throw Error(o(418));
          t = Jt(n.nextSibling);
          var r = rt;
          t && ac(e, t)
            ? lc(r, n)
            : ((e.flags = (e.flags & -4097) | 2), (ye = !1), (rt = e));
        }
      } else {
        if (ga(e)) throw Error(o(418));
        ((e.flags = (e.flags & -4097) | 2), (ye = !1), (rt = e));
      }
    }
  }
  function ic(e) {
    for (
      e = e.return;
      e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;
    )
      e = e.return;
    rt = e;
  }
  function Ps(e) {
    if (e !== rt) return !1;
    if (!ye) return (ic(e), (ye = !0), !1);
    var t;
    if (
      ((t = e.tag !== 3) &&
        !(t = e.tag !== 5) &&
        ((t = e.type),
        (t = t !== "head" && t !== "body" && !ca(e.type, e.memoizedProps))),
      t && (t = st))
    ) {
      if (ga(e)) throw (oc(), Error(o(418)));
      for (; t; ) (lc(e, t), (t = Jt(t.nextSibling)));
    }
    if ((ic(e), e.tag === 13)) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(o(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                st = Jt(e.nextSibling);
                break e;
              }
              t--;
            } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
          }
          e = e.nextSibling;
        }
        st = null;
      }
    } else st = rt ? Jt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function oc() {
    for (var e = st; e; ) e = Jt(e.nextSibling);
  }
  function Wn() {
    ((st = rt = null), (ye = !1));
  }
  function ya(e) {
    wt === null ? (wt = [e]) : wt.push(e);
  }
  var Gm = Z.ReactCurrentBatchConfig;
  function Er(e, t, n) {
    if (
      ((e = n.ref),
      e !== null && typeof e != "function" && typeof e != "object")
    ) {
      if (n._owner) {
        if (((n = n._owner), n)) {
          if (n.tag !== 1) throw Error(o(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(o(147, e));
        var l = r,
          i = "" + e;
        return t !== null &&
          t.ref !== null &&
          typeof t.ref == "function" &&
          t.ref._stringRef === i
          ? t.ref
          : ((t = function (c) {
              var d = l.refs;
              c === null ? delete d[i] : (d[i] = c);
            }),
            (t._stringRef = i),
            t);
      }
      if (typeof e != "string") throw Error(o(284));
      if (!n._owner) throw Error(o(290, e));
    }
    return e;
  }
  function Rs(e, t) {
    throw (
      (e = Object.prototype.toString.call(t)),
      Error(
        o(
          31,
          e === "[object Object]"
            ? "object with keys {" + Object.keys(t).join(", ") + "}"
            : e,
        ),
      )
    );
  }
  function cc(e) {
    var t = e._init;
    return t(e._payload);
  }
  function uc(e) {
    function t(w, x) {
      if (e) {
        var b = w.deletions;
        b === null ? ((w.deletions = [x]), (w.flags |= 16)) : b.push(x);
      }
    }
    function n(w, x) {
      if (!e) return null;
      for (; x !== null; ) (t(w, x), (x = x.sibling));
      return null;
    }
    function r(w, x) {
      for (w = new Map(); x !== null; )
        (x.key !== null ? w.set(x.key, x) : w.set(x.index, x), (x = x.sibling));
      return w;
    }
    function l(w, x) {
      return ((w = un(w, x)), (w.index = 0), (w.sibling = null), w);
    }
    function i(w, x, b) {
      return (
        (w.index = b),
        e
          ? ((b = w.alternate),
            b !== null
              ? ((b = b.index), b < x ? ((w.flags |= 2), x) : b)
              : ((w.flags |= 2), x))
          : ((w.flags |= 1048576), x)
      );
    }
    function c(w) {
      return (e && w.alternate === null && (w.flags |= 2), w);
    }
    function d(w, x, b, L) {
      return x === null || x.tag !== 6
        ? ((x = ui(b, w.mode, L)), (x.return = w), x)
        : ((x = l(x, b)), (x.return = w), x);
    }
    function p(w, x, b, L) {
      var W = b.type;
      return W === G
        ? T(w, x, b.props.children, L, b.key)
        : x !== null &&
            (x.elementType === W ||
              (typeof W == "object" &&
                W !== null &&
                W.$$typeof === We &&
                cc(W) === x.type))
          ? ((L = l(x, b.props)), (L.ref = Er(w, x, b)), (L.return = w), L)
          : ((L = rl(b.type, b.key, b.props, null, w.mode, L)),
            (L.ref = Er(w, x, b)),
            (L.return = w),
            L);
    }
    function k(w, x, b, L) {
      return x === null ||
        x.tag !== 4 ||
        x.stateNode.containerInfo !== b.containerInfo ||
        x.stateNode.implementation !== b.implementation
        ? ((x = di(b, w.mode, L)), (x.return = w), x)
        : ((x = l(x, b.children || [])), (x.return = w), x);
    }
    function T(w, x, b, L, W) {
      return x === null || x.tag !== 7
        ? ((x = Sn(b, w.mode, L, W)), (x.return = w), x)
        : ((x = l(x, b)), (x.return = w), x);
    }
    function A(w, x, b) {
      if ((typeof x == "string" && x !== "") || typeof x == "number")
        return ((x = ui("" + x, w.mode, b)), (x.return = w), x);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case be:
            return (
              (b = rl(x.type, x.key, x.props, null, w.mode, b)),
              (b.ref = Er(w, null, x)),
              (b.return = w),
              b
            );
          case ee:
            return ((x = di(x, w.mode, b)), (x.return = w), x);
          case We:
            var L = x._init;
            return A(w, L(x._payload), b);
        }
        if (rr(x) || X(x))
          return ((x = Sn(x, w.mode, b, null)), (x.return = w), x);
        Rs(w, x);
      }
      return null;
    }
    function M(w, x, b, L) {
      var W = x !== null ? x.key : null;
      if ((typeof b == "string" && b !== "") || typeof b == "number")
        return W !== null ? null : d(w, x, "" + b, L);
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case be:
            return b.key === W ? p(w, x, b, L) : null;
          case ee:
            return b.key === W ? k(w, x, b, L) : null;
          case We:
            return ((W = b._init), M(w, x, W(b._payload), L));
        }
        if (rr(b) || X(b)) return W !== null ? null : T(w, x, b, L, null);
        Rs(w, b);
      }
      return null;
    }
    function F(w, x, b, L, W) {
      if ((typeof L == "string" && L !== "") || typeof L == "number")
        return ((w = w.get(b) || null), d(x, w, "" + L, W));
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case be:
            return (
              (w = w.get(L.key === null ? b : L.key) || null),
              p(x, w, L, W)
            );
          case ee:
            return (
              (w = w.get(L.key === null ? b : L.key) || null),
              k(x, w, L, W)
            );
          case We:
            var Y = L._init;
            return F(w, x, b, Y(L._payload), W);
        }
        if (rr(L) || X(L)) return ((w = w.get(b) || null), T(x, w, L, W, null));
        Rs(x, L);
      }
      return null;
    }
    function V(w, x, b, L) {
      for (
        var W = null, Y = null, q = x, J = (x = 0), Ae = null;
        q !== null && J < b.length;
        J++
      ) {
        q.index > J ? ((Ae = q), (q = null)) : (Ae = q.sibling);
        var ce = M(w, q, b[J], L);
        if (ce === null) {
          q === null && (q = Ae);
          break;
        }
        (e && q && ce.alternate === null && t(w, q),
          (x = i(ce, x, J)),
          Y === null ? (W = ce) : (Y.sibling = ce),
          (Y = ce),
          (q = Ae));
      }
      if (J === b.length) return (n(w, q), ye && gn(w, J), W);
      if (q === null) {
        for (; J < b.length; J++)
          ((q = A(w, b[J], L)),
            q !== null &&
              ((x = i(q, x, J)),
              Y === null ? (W = q) : (Y.sibling = q),
              (Y = q)));
        return (ye && gn(w, J), W);
      }
      for (q = r(w, q); J < b.length; J++)
        ((Ae = F(q, w, J, b[J], L)),
          Ae !== null &&
            (e &&
              Ae.alternate !== null &&
              q.delete(Ae.key === null ? J : Ae.key),
            (x = i(Ae, x, J)),
            Y === null ? (W = Ae) : (Y.sibling = Ae),
            (Y = Ae)));
      return (
        e &&
          q.forEach(function (dn) {
            return t(w, dn);
          }),
        ye && gn(w, J),
        W
      );
    }
    function H(w, x, b, L) {
      var W = X(b);
      if (typeof W != "function") throw Error(o(150));
      if (((b = W.call(b)), b == null)) throw Error(o(151));
      for (
        var Y = (W = null), q = x, J = (x = 0), Ae = null, ce = b.next();
        q !== null && !ce.done;
        J++, ce = b.next()
      ) {
        q.index > J ? ((Ae = q), (q = null)) : (Ae = q.sibling);
        var dn = M(w, q, ce.value, L);
        if (dn === null) {
          q === null && (q = Ae);
          break;
        }
        (e && q && dn.alternate === null && t(w, q),
          (x = i(dn, x, J)),
          Y === null ? (W = dn) : (Y.sibling = dn),
          (Y = dn),
          (q = Ae));
      }
      if (ce.done) return (n(w, q), ye && gn(w, J), W);
      if (q === null) {
        for (; !ce.done; J++, ce = b.next())
          ((ce = A(w, ce.value, L)),
            ce !== null &&
              ((x = i(ce, x, J)),
              Y === null ? (W = ce) : (Y.sibling = ce),
              (Y = ce)));
        return (ye && gn(w, J), W);
      }
      for (q = r(w, q); !ce.done; J++, ce = b.next())
        ((ce = F(q, w, J, ce.value, L)),
          ce !== null &&
            (e &&
              ce.alternate !== null &&
              q.delete(ce.key === null ? J : ce.key),
            (x = i(ce, x, J)),
            Y === null ? (W = ce) : (Y.sibling = ce),
            (Y = ce)));
      return (
        e &&
          q.forEach(function (Mp) {
            return t(w, Mp);
          }),
        ye && gn(w, J),
        W
      );
    }
    function _e(w, x, b, L) {
      if (
        (typeof b == "object" &&
          b !== null &&
          b.type === G &&
          b.key === null &&
          (b = b.props.children),
        typeof b == "object" && b !== null)
      ) {
        switch (b.$$typeof) {
          case be:
            e: {
              for (var W = b.key, Y = x; Y !== null; ) {
                if (Y.key === W) {
                  if (((W = b.type), W === G)) {
                    if (Y.tag === 7) {
                      (n(w, Y.sibling),
                        (x = l(Y, b.props.children)),
                        (x.return = w),
                        (w = x));
                      break e;
                    }
                  } else if (
                    Y.elementType === W ||
                    (typeof W == "object" &&
                      W !== null &&
                      W.$$typeof === We &&
                      cc(W) === Y.type)
                  ) {
                    (n(w, Y.sibling),
                      (x = l(Y, b.props)),
                      (x.ref = Er(w, Y, b)),
                      (x.return = w),
                      (w = x));
                    break e;
                  }
                  n(w, Y);
                  break;
                } else t(w, Y);
                Y = Y.sibling;
              }
              b.type === G
                ? ((x = Sn(b.props.children, w.mode, L, b.key)),
                  (x.return = w),
                  (w = x))
                : ((L = rl(b.type, b.key, b.props, null, w.mode, L)),
                  (L.ref = Er(w, x, b)),
                  (L.return = w),
                  (w = L));
            }
            return c(w);
          case ee:
            e: {
              for (Y = b.key; x !== null; ) {
                if (x.key === Y)
                  if (
                    x.tag === 4 &&
                    x.stateNode.containerInfo === b.containerInfo &&
                    x.stateNode.implementation === b.implementation
                  ) {
                    (n(w, x.sibling),
                      (x = l(x, b.children || [])),
                      (x.return = w),
                      (w = x));
                    break e;
                  } else {
                    n(w, x);
                    break;
                  }
                else t(w, x);
                x = x.sibling;
              }
              ((x = di(b, w.mode, L)), (x.return = w), (w = x));
            }
            return c(w);
          case We:
            return ((Y = b._init), _e(w, x, Y(b._payload), L));
        }
        if (rr(b)) return V(w, x, b, L);
        if (X(b)) return H(w, x, b, L);
        Rs(w, b);
      }
      return (typeof b == "string" && b !== "") || typeof b == "number"
        ? ((b = "" + b),
          x !== null && x.tag === 6
            ? (n(w, x.sibling), (x = l(x, b)), (x.return = w), (w = x))
            : (n(w, x), (x = ui(b, w.mode, L)), (x.return = w), (w = x)),
          c(w))
        : n(w, x);
    }
    return _e;
  }
  var Qn = uc(!0),
    dc = uc(!1),
    As = Zt(null),
    Ds = null,
    Yn = null,
    wa = null;
  function ja() {
    wa = Yn = Ds = null;
  }
  function Na(e) {
    var t = As.current;
    (ge(As), (e._currentValue = t));
  }
  function ba(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
          : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function qn(e, t) {
    ((Ds = e),
      (wa = Yn = null),
      (e = e.dependencies),
      e !== null &&
        e.firstContext !== null &&
        ((e.lanes & t) !== 0 && (qe = !0), (e.firstContext = null)));
  }
  function ct(e) {
    var t = e._currentValue;
    if (wa !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), Yn === null)) {
        if (Ds === null) throw Error(o(308));
        ((Yn = e), (Ds.dependencies = { lanes: 0, firstContext: e }));
      } else Yn = Yn.next = e;
    return t;
  }
  var vn = null;
  function ka(e) {
    vn === null ? (vn = [e]) : vn.push(e);
  }
  function fc(e, t, n, r) {
    var l = t.interleaved;
    return (
      l === null ? ((n.next = n), ka(t)) : ((n.next = l.next), (l.next = n)),
      (t.interleaved = n),
      Ut(e, r)
    );
  }
  function Ut(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
      ((e.childLanes |= t),
        (n = e.alternate),
        n !== null && (n.childLanes |= t),
        (n = e),
        (e = e.return));
    return n.tag === 3 ? n.stateNode : null;
  }
  var nn = !1;
  function Sa(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function mc(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        }));
  }
  function Vt(e, t) {
    return {
      eventTime: e,
      lane: t,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
    };
  }
  function rn(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (((r = r.shared), (ae & 2) !== 0)) {
      var l = r.pending;
      return (
        l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
        (r.pending = t),
        Ut(e, n)
      );
    }
    return (
      (l = r.interleaved),
      l === null ? ((t.next = t), ka(r)) : ((t.next = l.next), (l.next = t)),
      (r.interleaved = t),
      Ut(e, n)
    );
  }
  function Ls(e, t, n) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
    ) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Fl(e, n));
    }
  }
  function pc(e, t) {
    var n = e.updateQueue,
      r = e.alternate;
    if (r !== null && ((r = r.updateQueue), n === r)) {
      var l = null,
        i = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var c = {
            eventTime: n.eventTime,
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: n.callback,
            next: null,
          };
          (i === null ? (l = i = c) : (i = i.next = c), (n = n.next));
        } while (n !== null);
        i === null ? (l = i = t) : (i = i.next = t);
      } else l = i = t;
      ((n = {
        baseState: r.baseState,
        firstBaseUpdate: l,
        lastBaseUpdate: i,
        shared: r.shared,
        effects: r.effects,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  function $s(e, t, n, r) {
    var l = e.updateQueue;
    nn = !1;
    var i = l.firstBaseUpdate,
      c = l.lastBaseUpdate,
      d = l.shared.pending;
    if (d !== null) {
      l.shared.pending = null;
      var p = d,
        k = p.next;
      ((p.next = null), c === null ? (i = k) : (c.next = k), (c = p));
      var T = e.alternate;
      T !== null &&
        ((T = T.updateQueue),
        (d = T.lastBaseUpdate),
        d !== c &&
          (d === null ? (T.firstBaseUpdate = k) : (d.next = k),
          (T.lastBaseUpdate = p)));
    }
    if (i !== null) {
      var A = l.baseState;
      ((c = 0), (T = k = p = null), (d = i));
      do {
        var M = d.lane,
          F = d.eventTime;
        if ((r & M) === M) {
          T !== null &&
            (T = T.next =
              {
                eventTime: F,
                lane: 0,
                tag: d.tag,
                payload: d.payload,
                callback: d.callback,
                next: null,
              });
          e: {
            var V = e,
              H = d;
            switch (((M = t), (F = n), H.tag)) {
              case 1:
                if (((V = H.payload), typeof V == "function")) {
                  A = V.call(F, A, M);
                  break e;
                }
                A = V;
                break e;
              case 3:
                V.flags = (V.flags & -65537) | 128;
              case 0:
                if (
                  ((V = H.payload),
                  (M = typeof V == "function" ? V.call(F, A, M) : V),
                  M == null)
                )
                  break e;
                A = U({}, A, M);
                break e;
              case 2:
                nn = !0;
            }
          }
          d.callback !== null &&
            d.lane !== 0 &&
            ((e.flags |= 64),
            (M = l.effects),
            M === null ? (l.effects = [d]) : M.push(d));
        } else
          ((F = {
            eventTime: F,
            lane: M,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null,
          }),
            T === null ? ((k = T = F), (p = A)) : (T = T.next = F),
            (c |= M));
        if (((d = d.next), d === null)) {
          if (((d = l.shared.pending), d === null)) break;
          ((M = d),
            (d = M.next),
            (M.next = null),
            (l.lastBaseUpdate = M),
            (l.shared.pending = null));
        }
      } while (!0);
      if (
        (T === null && (p = A),
        (l.baseState = p),
        (l.firstBaseUpdate = k),
        (l.lastBaseUpdate = T),
        (t = l.shared.interleaved),
        t !== null)
      ) {
        l = t;
        do ((c |= l.lane), (l = l.next));
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      ((jn |= c), (e.lanes = c), (e.memoizedState = A));
    }
  }
  function hc(e, t, n) {
    if (((e = t.effects), (t.effects = null), e !== null))
      for (t = 0; t < e.length; t++) {
        var r = e[t],
          l = r.callback;
        if (l !== null) {
          if (((r.callback = null), (r = n), typeof l != "function"))
            throw Error(o(191, l));
          l.call(r);
        }
      }
  }
  var Mr = {},
    Mt = Zt(Mr),
    zr = Zt(Mr),
    Tr = Zt(Mr);
  function yn(e) {
    if (e === Mr) throw Error(o(174));
    return e;
  }
  function Ca(e, t) {
    switch ((he(Tr, t), he(zr, e), he(Mt, Mr), (e = t.nodeType), e)) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : _l(null, "");
        break;
      default:
        ((e = e === 8 ? t.parentNode : t),
          (t = e.namespaceURI || null),
          (e = e.tagName),
          (t = _l(t, e)));
    }
    (ge(Mt), he(Mt, t));
  }
  function Kn() {
    (ge(Mt), ge(zr), ge(Tr));
  }
  function xc(e) {
    yn(Tr.current);
    var t = yn(Mt.current),
      n = _l(t, e.type);
    t !== n && (he(zr, e), he(Mt, n));
  }
  function _a(e) {
    zr.current === e && (ge(Mt), ge(zr));
  }
  var je = Zt(0);
  function Os(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (
          n !== null &&
          ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
        )
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Ea = [];
  function Ma() {
    for (var e = 0; e < Ea.length; e++)
      Ea[e]._workInProgressVersionPrimary = null;
    Ea.length = 0;
  }
  var Fs = Z.ReactCurrentDispatcher,
    za = Z.ReactCurrentBatchConfig,
    wn = 0,
    Ne = null,
    Me = null,
    Pe = null,
    Is = !1,
    Pr = !1,
    Rr = 0,
    Xm = 0;
  function Fe() {
    throw Error(o(321));
  }
  function Ta(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!yt(e[n], t[n])) return !1;
    return !0;
  }
  function Pa(e, t, n, r, l, i) {
    if (
      ((wn = i),
      (Ne = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (Fs.current = e === null || e.memoizedState === null ? tp : np),
      (e = n(r, l)),
      Pr)
    ) {
      i = 0;
      do {
        if (((Pr = !1), (Rr = 0), 25 <= i)) throw Error(o(301));
        ((i += 1),
          (Pe = Me = null),
          (t.updateQueue = null),
          (Fs.current = rp),
          (e = n(r, l)));
      } while (Pr);
    }
    if (
      ((Fs.current = Vs),
      (t = Me !== null && Me.next !== null),
      (wn = 0),
      (Pe = Me = Ne = null),
      (Is = !1),
      t)
    )
      throw Error(o(300));
    return e;
  }
  function Ra() {
    var e = Rr !== 0;
    return ((Rr = 0), e);
  }
  function zt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Pe === null ? (Ne.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe);
  }
  function ut() {
    if (Me === null) {
      var e = Ne.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Me.next;
    var t = Pe === null ? Ne.memoizedState : Pe.next;
    if (t !== null) ((Pe = t), (Me = e));
    else {
      if (e === null) throw Error(o(310));
      ((Me = e),
        (e = {
          memoizedState: Me.memoizedState,
          baseState: Me.baseState,
          baseQueue: Me.baseQueue,
          queue: Me.queue,
          next: null,
        }),
        Pe === null ? (Ne.memoizedState = Pe = e) : (Pe = Pe.next = e));
    }
    return Pe;
  }
  function Ar(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Aa(e) {
    var t = ut(),
      n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var r = Me,
      l = r.baseQueue,
      i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var c = l.next;
        ((l.next = i.next), (i.next = c));
      }
      ((r.baseQueue = l = i), (n.pending = null));
    }
    if (l !== null) {
      ((i = l.next), (r = r.baseState));
      var d = (c = null),
        p = null,
        k = i;
      do {
        var T = k.lane;
        if ((wn & T) === T)
          (p !== null &&
            (p = p.next =
              {
                lane: 0,
                action: k.action,
                hasEagerState: k.hasEagerState,
                eagerState: k.eagerState,
                next: null,
              }),
            (r = k.hasEagerState ? k.eagerState : e(r, k.action)));
        else {
          var A = {
            lane: T,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null,
          };
          (p === null ? ((d = p = A), (c = r)) : (p = p.next = A),
            (Ne.lanes |= T),
            (jn |= T));
        }
        k = k.next;
      } while (k !== null && k !== i);
      (p === null ? (c = r) : (p.next = d),
        yt(r, t.memoizedState) || (qe = !0),
        (t.memoizedState = r),
        (t.baseState = c),
        (t.baseQueue = p),
        (n.lastRenderedState = r));
    }
    if (((e = n.interleaved), e !== null)) {
      l = e;
      do ((i = l.lane), (Ne.lanes |= i), (jn |= i), (l = l.next));
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Da(e) {
    var t = ut(),
      n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch,
      l = n.pending,
      i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var c = (l = l.next);
      do ((i = e(i, c.action)), (c = c.next));
      while (c !== l);
      (yt(i, t.memoizedState) || (qe = !0),
        (t.memoizedState = i),
        t.baseQueue === null && (t.baseState = i),
        (n.lastRenderedState = i));
    }
    return [i, r];
  }
  function gc() {}
  function vc(e, t) {
    var n = Ne,
      r = ut(),
      l = t(),
      i = !yt(r.memoizedState, l);
    if (
      (i && ((r.memoizedState = l), (qe = !0)),
      (r = r.queue),
      La(jc.bind(null, n, r, e), [e]),
      r.getSnapshot !== t || i || (Pe !== null && Pe.memoizedState.tag & 1))
    ) {
      if (
        ((n.flags |= 2048),
        Dr(9, wc.bind(null, n, r, l, t), void 0, null),
        Re === null)
      )
        throw Error(o(349));
      (wn & 30) !== 0 || yc(n, t, l);
    }
    return l;
  }
  function yc(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = Ne.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (Ne.updateQueue = t),
          (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function wc(e, t, n, r) {
    ((t.value = n), (t.getSnapshot = r), Nc(t) && bc(e));
  }
  function jc(e, t, n) {
    return n(function () {
      Nc(t) && bc(e);
    });
  }
  function Nc(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !yt(e, n);
    } catch {
      return !0;
    }
  }
  function bc(e) {
    var t = Ut(e, 1);
    t !== null && kt(t, e, 1, -1);
  }
  function kc(e) {
    var t = zt();
    return (
      typeof e == "function" && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ar,
        lastRenderedState: e,
      }),
      (t.queue = e),
      (e = e.dispatch = ep.bind(null, Ne, e)),
      [t.memoizedState, e]
    );
  }
  function Dr(e, t, n, r) {
    return (
      (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
      (t = Ne.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }),
          (Ne.updateQueue = t),
          (t.lastEffect = e.next = e))
        : ((n = t.lastEffect),
          n === null
            ? (t.lastEffect = e.next = e)
            : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
      e
    );
  }
  function Sc() {
    return ut().memoizedState;
  }
  function Bs(e, t, n, r) {
    var l = zt();
    ((Ne.flags |= e),
      (l.memoizedState = Dr(1 | t, n, void 0, r === void 0 ? null : r)));
  }
  function Us(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (Me !== null) {
      var c = Me.memoizedState;
      if (((i = c.destroy), r !== null && Ta(r, c.deps))) {
        l.memoizedState = Dr(t, n, i, r);
        return;
      }
    }
    ((Ne.flags |= e), (l.memoizedState = Dr(1 | t, n, i, r)));
  }
  function Cc(e, t) {
    return Bs(8390656, 8, e, t);
  }
  function La(e, t) {
    return Us(2048, 8, e, t);
  }
  function _c(e, t) {
    return Us(4, 2, e, t);
  }
  function Ec(e, t) {
    return Us(4, 4, e, t);
  }
  function Mc(e, t) {
    if (typeof t == "function")
      return (
        (e = e()),
        t(e),
        function () {
          t(null);
        }
      );
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function zc(e, t, n) {
    return (
      (n = n != null ? n.concat([e]) : null),
      Us(4, 4, Mc.bind(null, t, e), n)
    );
  }
  function $a() {}
  function Tc(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Ta(t, r[1])
      ? r[0]
      : ((n.memoizedState = [e, t]), e);
  }
  function Pc(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Ta(t, r[1])
      ? r[0]
      : ((e = e()), (n.memoizedState = [e, t]), e);
  }
  function Rc(e, t, n) {
    return (wn & 21) === 0
      ? (e.baseState && ((e.baseState = !1), (qe = !0)), (e.memoizedState = n))
      : (yt(n, t) ||
          ((n = oo()), (Ne.lanes |= n), (jn |= n), (e.baseState = !0)),
        t);
  }
  function Jm(e, t) {
    var n = me;
    ((me = n !== 0 && 4 > n ? n : 4), e(!0));
    var r = za.transition;
    za.transition = {};
    try {
      (e(!1), t());
    } finally {
      ((me = n), (za.transition = r));
    }
  }
  function Ac() {
    return ut().memoizedState;
  }
  function Zm(e, t, n) {
    var r = on(e);
    if (
      ((n = {
        lane: r,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Dc(e))
    )
      Lc(t, n);
    else if (((n = fc(e, t, n, r)), n !== null)) {
      var l = Ve();
      (kt(n, e, r, l), $c(n, t, r));
    }
  }
  function ep(e, t, n) {
    var r = on(e),
      l = {
        lane: r,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
    if (Dc(e)) Lc(t, l);
    else {
      var i = e.alternate;
      if (
        e.lanes === 0 &&
        (i === null || i.lanes === 0) &&
        ((i = t.lastRenderedReducer), i !== null)
      )
        try {
          var c = t.lastRenderedState,
            d = i(c, n);
          if (((l.hasEagerState = !0), (l.eagerState = d), yt(d, c))) {
            var p = t.interleaved;
            (p === null
              ? ((l.next = l), ka(t))
              : ((l.next = p.next), (p.next = l)),
              (t.interleaved = l));
            return;
          }
        } catch {
        } finally {
        }
      ((n = fc(e, t, l, r)),
        n !== null && ((l = Ve()), kt(n, e, r, l), $c(n, t, r)));
    }
  }
  function Dc(e) {
    var t = e.alternate;
    return e === Ne || (t !== null && t === Ne);
  }
  function Lc(e, t) {
    Pr = Is = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
      (e.pending = t));
  }
  function $c(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Fl(e, n));
    }
  }
  var Vs = {
      readContext: ct,
      useCallback: Fe,
      useContext: Fe,
      useEffect: Fe,
      useImperativeHandle: Fe,
      useInsertionEffect: Fe,
      useLayoutEffect: Fe,
      useMemo: Fe,
      useReducer: Fe,
      useRef: Fe,
      useState: Fe,
      useDebugValue: Fe,
      useDeferredValue: Fe,
      useTransition: Fe,
      useMutableSource: Fe,
      useSyncExternalStore: Fe,
      useId: Fe,
      unstable_isNewReconciler: !1,
    },
    tp = {
      readContext: ct,
      useCallback: function (e, t) {
        return ((zt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: ct,
      useEffect: Cc,
      useImperativeHandle: function (e, t, n) {
        return (
          (n = n != null ? n.concat([e]) : null),
          Bs(4194308, 4, Mc.bind(null, t, e), n)
        );
      },
      useLayoutEffect: function (e, t) {
        return Bs(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        return Bs(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = zt();
        return (
          (t = t === void 0 ? null : t),
          (e = e()),
          (n.memoizedState = [e, t]),
          e
        );
      },
      useReducer: function (e, t, n) {
        var r = zt();
        return (
          (t = n !== void 0 ? n(t) : t),
          (r.memoizedState = r.baseState = t),
          (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
          (r.queue = e),
          (e = e.dispatch = Zm.bind(null, Ne, e)),
          [r.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = zt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: kc,
      useDebugValue: $a,
      useDeferredValue: function (e) {
        return (zt().memoizedState = e);
      },
      useTransition: function () {
        var e = kc(!1),
          t = e[0];
        return ((e = Jm.bind(null, e[1])), (zt().memoizedState = e), [t, e]);
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, n) {
        var r = Ne,
          l = zt();
        if (ye) {
          if (n === void 0) throw Error(o(407));
          n = n();
        } else {
          if (((n = t()), Re === null)) throw Error(o(349));
          (wn & 30) !== 0 || yc(r, t, n);
        }
        l.memoizedState = n;
        var i = { value: n, getSnapshot: t };
        return (
          (l.queue = i),
          Cc(jc.bind(null, r, i, e), [e]),
          (r.flags |= 2048),
          Dr(9, wc.bind(null, r, i, n, t), void 0, null),
          n
        );
      },
      useId: function () {
        var e = zt(),
          t = Re.identifierPrefix;
        if (ye) {
          var n = Bt,
            r = It;
          ((n = (r & ~(1 << (32 - vt(r) - 1))).toString(32) + n),
            (t = ":" + t + "R" + n),
            (n = Rr++),
            0 < n && (t += "H" + n.toString(32)),
            (t += ":"));
        } else ((n = Xm++), (t = ":" + t + "r" + n.toString(32) + ":"));
        return (e.memoizedState = t);
      },
      unstable_isNewReconciler: !1,
    },
    np = {
      readContext: ct,
      useCallback: Tc,
      useContext: ct,
      useEffect: La,
      useImperativeHandle: zc,
      useInsertionEffect: _c,
      useLayoutEffect: Ec,
      useMemo: Pc,
      useReducer: Aa,
      useRef: Sc,
      useState: function () {
        return Aa(Ar);
      },
      useDebugValue: $a,
      useDeferredValue: function (e) {
        var t = ut();
        return Rc(t, Me.memoizedState, e);
      },
      useTransition: function () {
        var e = Aa(Ar)[0],
          t = ut().memoizedState;
        return [e, t];
      },
      useMutableSource: gc,
      useSyncExternalStore: vc,
      useId: Ac,
      unstable_isNewReconciler: !1,
    },
    rp = {
      readContext: ct,
      useCallback: Tc,
      useContext: ct,
      useEffect: La,
      useImperativeHandle: zc,
      useInsertionEffect: _c,
      useLayoutEffect: Ec,
      useMemo: Pc,
      useReducer: Da,
      useRef: Sc,
      useState: function () {
        return Da(Ar);
      },
      useDebugValue: $a,
      useDeferredValue: function (e) {
        var t = ut();
        return Me === null ? (t.memoizedState = e) : Rc(t, Me.memoizedState, e);
      },
      useTransition: function () {
        var e = Da(Ar)[0],
          t = ut().memoizedState;
        return [e, t];
      },
      useMutableSource: gc,
      useSyncExternalStore: vc,
      useId: Ac,
      unstable_isNewReconciler: !1,
    };
  function jt(e, t) {
    if (e && e.defaultProps) {
      ((t = U({}, t)), (e = e.defaultProps));
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function Oa(e, t, n, r) {
    ((t = e.memoizedState),
      (n = n(r, t)),
      (n = n == null ? t : U({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var Hs = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? mn(e) === e : !1;
    },
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ve(),
        l = on(e),
        i = Vt(r, l);
      ((i.payload = t),
        n != null && (i.callback = n),
        (t = rn(e, i, l)),
        t !== null && (kt(t, e, l, r), Ls(t, e, l)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ve(),
        l = on(e),
        i = Vt(r, l);
      ((i.tag = 1),
        (i.payload = t),
        n != null && (i.callback = n),
        (t = rn(e, i, l)),
        t !== null && (kt(t, e, l, r), Ls(t, e, l)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = Ve(),
        r = on(e),
        l = Vt(n, r);
      ((l.tag = 2),
        t != null && (l.callback = t),
        (t = rn(e, l, r)),
        t !== null && (kt(t, e, r, n), Ls(t, e, r)));
    },
  };
  function Oc(e, t, n, r, l, i, c) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(r, i, c)
        : t.prototype && t.prototype.isPureReactComponent
          ? !jr(n, r) || !jr(l, i)
          : !0
    );
  }
  function Fc(e, t, n) {
    var r = !1,
      l = en,
      i = t.contextType;
    return (
      typeof i == "object" && i !== null
        ? (i = ct(i))
        : ((l = Ye(t) ? hn : Oe.current),
          (r = t.contextTypes),
          (i = (r = r != null) ? Un(e, l) : en)),
      (t = new t(n, i)),
      (e.memoizedState =
        t.state !== null && t.state !== void 0 ? t.state : null),
      (t.updater = Hs),
      (e.stateNode = t),
      (t._reactInternals = e),
      r &&
        ((e = e.stateNode),
        (e.__reactInternalMemoizedUnmaskedChildContext = l),
        (e.__reactInternalMemoizedMaskedChildContext = i)),
      t
    );
  }
  function Ic(e, t, n, r) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(n, r),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(n, r),
      t.state !== e && Hs.enqueueReplaceState(t, t.state, null));
  }
  function Fa(e, t, n, r) {
    var l = e.stateNode;
    ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), Sa(e));
    var i = t.contextType;
    (typeof i == "object" && i !== null
      ? (l.context = ct(i))
      : ((i = Ye(t) ? hn : Oe.current), (l.context = Un(e, i))),
      (l.state = e.memoizedState),
      (i = t.getDerivedStateFromProps),
      typeof i == "function" && (Oa(e, t, i, n), (l.state = e.memoizedState)),
      typeof t.getDerivedStateFromProps == "function" ||
        typeof l.getSnapshotBeforeUpdate == "function" ||
        (typeof l.UNSAFE_componentWillMount != "function" &&
          typeof l.componentWillMount != "function") ||
        ((t = l.state),
        typeof l.componentWillMount == "function" && l.componentWillMount(),
        typeof l.UNSAFE_componentWillMount == "function" &&
          l.UNSAFE_componentWillMount(),
        t !== l.state && Hs.enqueueReplaceState(l, l.state, null),
        $s(e, n, l, r),
        (l.state = e.memoizedState)),
      typeof l.componentDidMount == "function" && (e.flags |= 4194308));
  }
  function Gn(e, t) {
    try {
      var n = "",
        r = t;
      do ((n += ie(r)), (r = r.return));
      while (r);
      var l = n;
    } catch (i) {
      l =
        `
Error generating stack: ` +
        i.message +
        `
` +
        i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Ia(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function Ba(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  var sp = typeof WeakMap == "function" ? WeakMap : Map;
  function Bc(e, t, n) {
    ((n = Vt(-1, n)), (n.tag = 3), (n.payload = { element: null }));
    var r = t.value;
    return (
      (n.callback = function () {
        (Xs || ((Xs = !0), (ni = r)), Ba(e, t));
      }),
      n
    );
  }
  function Uc(e, t, n) {
    ((n = Vt(-1, n)), (n.tag = 3));
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      ((n.payload = function () {
        return r(l);
      }),
        (n.callback = function () {
          Ba(e, t);
        }));
    }
    var i = e.stateNode;
    return (
      i !== null &&
        typeof i.componentDidCatch == "function" &&
        (n.callback = function () {
          (Ba(e, t),
            typeof r != "function" &&
              (ln === null ? (ln = new Set([this])) : ln.add(this)));
          var c = t.stack;
          this.componentDidCatch(t.value, {
            componentStack: c !== null ? c : "",
          });
        }),
      n
    );
  }
  function Vc(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new sp();
      var l = new Set();
      r.set(t, l);
    } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
    l.has(n) || (l.add(n), (e = vp.bind(null, e, t, n)), t.then(e, e));
  }
  function Hc(e) {
    do {
      var t;
      if (
        ((t = e.tag === 13) &&
          ((t = e.memoizedState),
          (t = t !== null ? t.dehydrated !== null : !0)),
        t)
      )
        return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Wc(e, t, n, r, l) {
    return (e.mode & 1) === 0
      ? (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (n.flags |= 131072),
            (n.flags &= -52805),
            n.tag === 1 &&
              (n.alternate === null
                ? (n.tag = 17)
                : ((t = Vt(-1, 1)), (t.tag = 2), rn(n, t, 1))),
            (n.lanes |= 1)),
        e)
      : ((e.flags |= 65536), (e.lanes = l), e);
  }
  var lp = Z.ReactCurrentOwner,
    qe = !1;
  function Ue(e, t, n, r) {
    t.child = e === null ? dc(t, null, n, r) : Qn(t, e.child, n, r);
  }
  function Qc(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return (
      qn(t, l),
      (r = Pa(e, t, n, r, i, l)),
      (n = Ra()),
      e !== null && !qe
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~l),
          Ht(e, t, l))
        : (ye && n && ha(t), (t.flags |= 1), Ue(e, t, r, l), t.child)
    );
  }
  function Yc(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" &&
        !ci(i) &&
        i.defaultProps === void 0 &&
        n.compare === null &&
        n.defaultProps === void 0
        ? ((t.tag = 15), (t.type = i), qc(e, t, i, r, l))
        : ((e = rl(n.type, null, r, t, t.mode, l)),
          (e.ref = t.ref),
          (e.return = t),
          (t.child = e));
    }
    if (((i = e.child), (e.lanes & l) === 0)) {
      var c = i.memoizedProps;
      if (
        ((n = n.compare), (n = n !== null ? n : jr), n(c, r) && e.ref === t.ref)
      )
        return Ht(e, t, l);
    }
    return (
      (t.flags |= 1),
      (e = un(i, r)),
      (e.ref = t.ref),
      (e.return = t),
      (t.child = e)
    );
  }
  function qc(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (jr(i, r) && e.ref === t.ref)
        if (((qe = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
          (e.flags & 131072) !== 0 && (qe = !0);
        else return ((t.lanes = e.lanes), Ht(e, t, l));
    }
    return Ua(e, t, n, r, l);
  }
  function Kc(e, t, n) {
    var r = t.pendingProps,
      l = r.children,
      i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden")
      if ((t.mode & 1) === 0)
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          he(Jn, lt),
          (lt |= n));
      else {
        if ((n & 1073741824) === 0)
          return (
            (e = i !== null ? i.baseLanes | n : n),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = {
              baseLanes: e,
              cachePool: null,
              transitions: null,
            }),
            (t.updateQueue = null),
            he(Jn, lt),
            (lt |= e),
            null
          );
        ((t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          (r = i !== null ? i.baseLanes : n),
          he(Jn, lt),
          (lt |= r));
      }
    else
      (i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
        he(Jn, lt),
        (lt |= r));
    return (Ue(e, t, l, n), t.child);
  }
  function Gc(e, t) {
    var n = t.ref;
    ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
      ((t.flags |= 512), (t.flags |= 2097152));
  }
  function Ua(e, t, n, r, l) {
    var i = Ye(n) ? hn : Oe.current;
    return (
      (i = Un(t, i)),
      qn(t, l),
      (n = Pa(e, t, n, r, i, l)),
      (r = Ra()),
      e !== null && !qe
        ? ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~l),
          Ht(e, t, l))
        : (ye && r && ha(t), (t.flags |= 1), Ue(e, t, n, l), t.child)
    );
  }
  function Xc(e, t, n, r, l) {
    if (Ye(n)) {
      var i = !0;
      Es(t);
    } else i = !1;
    if ((qn(t, l), t.stateNode === null))
      (Qs(e, t), Fc(t, n, r), Fa(t, n, r, l), (r = !0));
    else if (e === null) {
      var c = t.stateNode,
        d = t.memoizedProps;
      c.props = d;
      var p = c.context,
        k = n.contextType;
      typeof k == "object" && k !== null
        ? (k = ct(k))
        : ((k = Ye(n) ? hn : Oe.current), (k = Un(t, k)));
      var T = n.getDerivedStateFromProps,
        A =
          typeof T == "function" ||
          typeof c.getSnapshotBeforeUpdate == "function";
      (A ||
        (typeof c.UNSAFE_componentWillReceiveProps != "function" &&
          typeof c.componentWillReceiveProps != "function") ||
        ((d !== r || p !== k) && Ic(t, c, r, k)),
        (nn = !1));
      var M = t.memoizedState;
      ((c.state = M),
        $s(t, r, c, l),
        (p = t.memoizedState),
        d !== r || M !== p || Qe.current || nn
          ? (typeof T == "function" && (Oa(t, n, T, r), (p = t.memoizedState)),
            (d = nn || Oc(t, n, d, r, M, p, k))
              ? (A ||
                  (typeof c.UNSAFE_componentWillMount != "function" &&
                    typeof c.componentWillMount != "function") ||
                  (typeof c.componentWillMount == "function" &&
                    c.componentWillMount(),
                  typeof c.UNSAFE_componentWillMount == "function" &&
                    c.UNSAFE_componentWillMount()),
                typeof c.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof c.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (c.props = r),
            (c.state = p),
            (c.context = k),
            (r = d))
          : (typeof c.componentDidMount == "function" && (t.flags |= 4194308),
            (r = !1)));
    } else {
      ((c = t.stateNode),
        mc(e, t),
        (d = t.memoizedProps),
        (k = t.type === t.elementType ? d : jt(t.type, d)),
        (c.props = k),
        (A = t.pendingProps),
        (M = c.context),
        (p = n.contextType),
        typeof p == "object" && p !== null
          ? (p = ct(p))
          : ((p = Ye(n) ? hn : Oe.current), (p = Un(t, p))));
      var F = n.getDerivedStateFromProps;
      ((T =
        typeof F == "function" ||
        typeof c.getSnapshotBeforeUpdate == "function") ||
        (typeof c.UNSAFE_componentWillReceiveProps != "function" &&
          typeof c.componentWillReceiveProps != "function") ||
        ((d !== A || M !== p) && Ic(t, c, r, p)),
        (nn = !1),
        (M = t.memoizedState),
        (c.state = M),
        $s(t, r, c, l));
      var V = t.memoizedState;
      d !== A || M !== V || Qe.current || nn
        ? (typeof F == "function" && (Oa(t, n, F, r), (V = t.memoizedState)),
          (k = nn || Oc(t, n, k, r, M, V, p) || !1)
            ? (T ||
                (typeof c.UNSAFE_componentWillUpdate != "function" &&
                  typeof c.componentWillUpdate != "function") ||
                (typeof c.componentWillUpdate == "function" &&
                  c.componentWillUpdate(r, V, p),
                typeof c.UNSAFE_componentWillUpdate == "function" &&
                  c.UNSAFE_componentWillUpdate(r, V, p)),
              typeof c.componentDidUpdate == "function" && (t.flags |= 4),
              typeof c.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof c.componentDidUpdate != "function" ||
                (d === e.memoizedProps && M === e.memoizedState) ||
                (t.flags |= 4),
              typeof c.getSnapshotBeforeUpdate != "function" ||
                (d === e.memoizedProps && M === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = r),
              (t.memoizedState = V)),
          (c.props = r),
          (c.state = V),
          (c.context = p),
          (r = k))
        : (typeof c.componentDidUpdate != "function" ||
            (d === e.memoizedProps && M === e.memoizedState) ||
            (t.flags |= 4),
          typeof c.getSnapshotBeforeUpdate != "function" ||
            (d === e.memoizedProps && M === e.memoizedState) ||
            (t.flags |= 1024),
          (r = !1));
    }
    return Va(e, t, n, r, i, l);
  }
  function Va(e, t, n, r, l, i) {
    Gc(e, t);
    var c = (t.flags & 128) !== 0;
    if (!r && !c) return (l && nc(t, n, !1), Ht(e, t, i));
    ((r = t.stateNode), (lp.current = t));
    var d =
      c && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return (
      (t.flags |= 1),
      e !== null && c
        ? ((t.child = Qn(t, e.child, null, i)), (t.child = Qn(t, null, d, i)))
        : Ue(e, t, d, i),
      (t.memoizedState = r.state),
      l && nc(t, n, !0),
      t.child
    );
  }
  function Jc(e) {
    var t = e.stateNode;
    (t.pendingContext
      ? ec(e, t.pendingContext, t.pendingContext !== t.context)
      : t.context && ec(e, t.context, !1),
      Ca(e, t.containerInfo));
  }
  function Zc(e, t, n, r, l) {
    return (Wn(), ya(l), (t.flags |= 256), Ue(e, t, n, r), t.child);
  }
  var Ha = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Wa(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function eu(e, t, n) {
    var r = t.pendingProps,
      l = je.current,
      i = !1,
      c = (t.flags & 128) !== 0,
      d;
    if (
      ((d = c) ||
        (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
      d
        ? ((i = !0), (t.flags &= -129))
        : (e === null || e.memoizedState !== null) && (l |= 1),
      he(je, l & 1),
      e === null)
    )
      return (
        va(t),
        (e = t.memoizedState),
        e !== null && ((e = e.dehydrated), e !== null)
          ? ((t.mode & 1) === 0
              ? (t.lanes = 1)
              : e.data === "$!"
                ? (t.lanes = 8)
                : (t.lanes = 1073741824),
            null)
          : ((c = r.children),
            (e = r.fallback),
            i
              ? ((r = t.mode),
                (i = t.child),
                (c = { mode: "hidden", children: c }),
                (r & 1) === 0 && i !== null
                  ? ((i.childLanes = 0), (i.pendingProps = c))
                  : (i = sl(c, r, 0, null)),
                (e = Sn(e, r, n, null)),
                (i.return = t),
                (e.return = t),
                (i.sibling = e),
                (t.child = i),
                (t.child.memoizedState = Wa(n)),
                (t.memoizedState = Ha),
                e)
              : Qa(t, c))
      );
    if (((l = e.memoizedState), l !== null && ((d = l.dehydrated), d !== null)))
      return ap(e, t, c, r, d, l, n);
    if (i) {
      ((i = r.fallback), (c = t.mode), (l = e.child), (d = l.sibling));
      var p = { mode: "hidden", children: r.children };
      return (
        (c & 1) === 0 && t.child !== l
          ? ((r = t.child),
            (r.childLanes = 0),
            (r.pendingProps = p),
            (t.deletions = null))
          : ((r = un(l, p)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
        d !== null ? (i = un(d, i)) : ((i = Sn(i, c, n, null)), (i.flags |= 2)),
        (i.return = t),
        (r.return = t),
        (r.sibling = i),
        (t.child = r),
        (r = i),
        (i = t.child),
        (c = e.child.memoizedState),
        (c =
          c === null
            ? Wa(n)
            : {
                baseLanes: c.baseLanes | n,
                cachePool: null,
                transitions: c.transitions,
              }),
        (i.memoizedState = c),
        (i.childLanes = e.childLanes & ~n),
        (t.memoizedState = Ha),
        r
      );
    }
    return (
      (i = e.child),
      (e = i.sibling),
      (r = un(i, { mode: "visible", children: r.children })),
      (t.mode & 1) === 0 && (r.lanes = n),
      (r.return = t),
      (r.sibling = null),
      e !== null &&
        ((n = t.deletions),
        n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
      (t.child = r),
      (t.memoizedState = null),
      r
    );
  }
  function Qa(e, t) {
    return (
      (t = sl({ mode: "visible", children: t }, e.mode, 0, null)),
      (t.return = e),
      (e.child = t)
    );
  }
  function Ws(e, t, n, r) {
    return (
      r !== null && ya(r),
      Qn(t, e.child, null, n),
      (e = Qa(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function ap(e, t, n, r, l, i, c) {
    if (n)
      return t.flags & 256
        ? ((t.flags &= -257), (r = Ia(Error(o(422)))), Ws(e, t, c, r))
        : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((i = r.fallback),
            (l = t.mode),
            (r = sl({ mode: "visible", children: r.children }, l, 0, null)),
            (i = Sn(i, l, c, null)),
            (i.flags |= 2),
            (r.return = t),
            (i.return = t),
            (r.sibling = i),
            (t.child = r),
            (t.mode & 1) !== 0 && Qn(t, e.child, null, c),
            (t.child.memoizedState = Wa(c)),
            (t.memoizedState = Ha),
            i);
    if ((t.mode & 1) === 0) return Ws(e, t, c, null);
    if (l.data === "$!") {
      if (((r = l.nextSibling && l.nextSibling.dataset), r)) var d = r.dgst;
      return (
        (r = d),
        (i = Error(o(419))),
        (r = Ia(i, r, void 0)),
        Ws(e, t, c, r)
      );
    }
    if (((d = (c & e.childLanes) !== 0), qe || d)) {
      if (((r = Re), r !== null)) {
        switch (c & -c) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        ((l = (l & (r.suspendedLanes | c)) !== 0 ? 0 : l),
          l !== 0 &&
            l !== i.retryLane &&
            ((i.retryLane = l), Ut(e, l), kt(r, e, l, -1)));
      }
      return (oi(), (r = Ia(Error(o(421)))), Ws(e, t, c, r));
    }
    return l.data === "$?"
      ? ((t.flags |= 128),
        (t.child = e.child),
        (t = yp.bind(null, e)),
        (l._reactRetry = t),
        null)
      : ((e = i.treeContext),
        (st = Jt(l.nextSibling)),
        (rt = t),
        (ye = !0),
        (wt = null),
        e !== null &&
          ((it[ot++] = It),
          (it[ot++] = Bt),
          (it[ot++] = xn),
          (It = e.id),
          (Bt = e.overflow),
          (xn = t)),
        (t = Qa(t, r.children)),
        (t.flags |= 4096),
        t);
  }
  function tu(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    (r !== null && (r.lanes |= t), ba(e.return, t, n));
  }
  function Ya(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: r,
          tail: n,
          tailMode: l,
        })
      : ((i.isBackwards = t),
        (i.rendering = null),
        (i.renderingStartTime = 0),
        (i.last = r),
        (i.tail = n),
        (i.tailMode = l));
  }
  function nu(e, t, n) {
    var r = t.pendingProps,
      l = r.revealOrder,
      i = r.tail;
    if ((Ue(e, t, r.children, n), (r = je.current), (r & 2) !== 0))
      ((r = (r & 1) | 2), (t.flags |= 128));
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && tu(e, n, t);
          else if (e.tag === 19) tu(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      r &= 1;
    }
    if ((he(je, r), (t.mode & 1) === 0)) t.memoizedState = null;
    else
      switch (l) {
        case "forwards":
          for (n = t.child, l = null; n !== null; )
            ((e = n.alternate),
              e !== null && Os(e) === null && (l = n),
              (n = n.sibling));
          ((n = l),
            n === null
              ? ((l = t.child), (t.child = null))
              : ((l = n.sibling), (n.sibling = null)),
            Ya(t, !1, l, n, i));
          break;
        case "backwards":
          for (n = null, l = t.child, t.child = null; l !== null; ) {
            if (((e = l.alternate), e !== null && Os(e) === null)) {
              t.child = l;
              break;
            }
            ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
          }
          Ya(t, !0, n, null, i);
          break;
        case "together":
          Ya(t, !1, null, null, void 0);
          break;
        default:
          t.memoizedState = null;
      }
    return t.child;
  }
  function Qs(e, t) {
    (t.mode & 1) === 0 &&
      e !== null &&
      ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
  }
  function Ht(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies),
      (jn |= t.lanes),
      (n & t.childLanes) === 0)
    )
      return null;
    if (e !== null && t.child !== e.child) throw Error(o(153));
    if (t.child !== null) {
      for (
        e = t.child, n = un(e, e.pendingProps), t.child = n, n.return = t;
        e.sibling !== null;
      )
        ((e = e.sibling),
          (n = n.sibling = un(e, e.pendingProps)),
          (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function ip(e, t, n) {
    switch (t.tag) {
      case 3:
        (Jc(t), Wn());
        break;
      case 5:
        xc(t);
        break;
      case 1:
        Ye(t.type) && Es(t);
        break;
      case 4:
        Ca(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context,
          l = t.memoizedProps.value;
        (he(As, r._currentValue), (r._currentValue = l));
        break;
      case 13:
        if (((r = t.memoizedState), r !== null))
          return r.dehydrated !== null
            ? (he(je, je.current & 1), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? eu(e, t, n)
              : (he(je, je.current & 1),
                (e = Ht(e, t, n)),
                e !== null ? e.sibling : null);
        he(je, je.current & 1);
        break;
      case 19:
        if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
          if (r) return nu(e, t, n);
          t.flags |= 128;
        }
        if (
          ((l = t.memoizedState),
          l !== null &&
            ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
          he(je, je.current),
          r)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((t.lanes = 0), Kc(e, t, n));
    }
    return Ht(e, t, n);
  }
  var ru, qa, su, lu;
  ((ru = function (e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        ((n.child.return = n), (n = n.child));
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      ((n.sibling.return = n.return), (n = n.sibling));
    }
  }),
    (qa = function () {}),
    (su = function (e, t, n, r) {
      var l = e.memoizedProps;
      if (l !== r) {
        ((e = t.stateNode), yn(Mt.current));
        var i = null;
        switch (n) {
          case "input":
            ((l = bl(e, l)), (r = bl(e, r)), (i = []));
            break;
          case "select":
            ((l = U({}, l, { value: void 0 })),
              (r = U({}, r, { value: void 0 })),
              (i = []));
            break;
          case "textarea":
            ((l = Cl(e, l)), (r = Cl(e, r)), (i = []));
            break;
          default:
            typeof l.onClick != "function" &&
              typeof r.onClick == "function" &&
              (e.onclick = Ss);
        }
        El(n, r);
        var c;
        n = null;
        for (k in l)
          if (!r.hasOwnProperty(k) && l.hasOwnProperty(k) && l[k] != null)
            if (k === "style") {
              var d = l[k];
              for (c in d) d.hasOwnProperty(c) && (n || (n = {}), (n[c] = ""));
            } else
              k !== "dangerouslySetInnerHTML" &&
                k !== "children" &&
                k !== "suppressContentEditableWarning" &&
                k !== "suppressHydrationWarning" &&
                k !== "autoFocus" &&
                (f.hasOwnProperty(k)
                  ? i || (i = [])
                  : (i = i || []).push(k, null));
        for (k in r) {
          var p = r[k];
          if (
            ((d = l != null ? l[k] : void 0),
            r.hasOwnProperty(k) && p !== d && (p != null || d != null))
          )
            if (k === "style")
              if (d) {
                for (c in d)
                  !d.hasOwnProperty(c) ||
                    (p && p.hasOwnProperty(c)) ||
                    (n || (n = {}), (n[c] = ""));
                for (c in p)
                  p.hasOwnProperty(c) &&
                    d[c] !== p[c] &&
                    (n || (n = {}), (n[c] = p[c]));
              } else (n || (i || (i = []), i.push(k, n)), (n = p));
            else
              k === "dangerouslySetInnerHTML"
                ? ((p = p ? p.__html : void 0),
                  (d = d ? d.__html : void 0),
                  p != null && d !== p && (i = i || []).push(k, p))
                : k === "children"
                  ? (typeof p != "string" && typeof p != "number") ||
                    (i = i || []).push(k, "" + p)
                  : k !== "suppressContentEditableWarning" &&
                    k !== "suppressHydrationWarning" &&
                    (f.hasOwnProperty(k)
                      ? (p != null && k === "onScroll" && xe("scroll", e),
                        i || d === p || (i = []))
                      : (i = i || []).push(k, p));
        }
        n && (i = i || []).push("style", n);
        var k = i;
        (t.updateQueue = k) && (t.flags |= 4);
      }
    }),
    (lu = function (e, t, n, r) {
      n !== r && (t.flags |= 4);
    }));
  function Lr(e, t) {
    if (!ye)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = e.tail;
          for (var r = null; n !== null; )
            (n.alternate !== null && (r = n), (n = n.sibling));
          r === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (r.sibling = null);
      }
  }
  function Ie(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      r = 0;
    if (t)
      for (var l = e.child; l !== null; )
        ((n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags & 14680064),
          (r |= l.flags & 14680064),
          (l.return = e),
          (l = l.sibling));
    else
      for (l = e.child; l !== null; )
        ((n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags),
          (r |= l.flags),
          (l.return = e),
          (l = l.sibling));
    return ((e.subtreeFlags |= r), (e.childLanes = n), t);
  }
  function op(e, t, n) {
    var r = t.pendingProps;
    switch ((xa(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (Ie(t), null);
      case 1:
        return (Ye(t.type) && _s(), Ie(t), null);
      case 3:
        return (
          (r = t.stateNode),
          Kn(),
          ge(Qe),
          ge(Oe),
          Ma(),
          r.pendingContext &&
            ((r.context = r.pendingContext), (r.pendingContext = null)),
          (e === null || e.child === null) &&
            (Ps(t)
              ? (t.flags |= 4)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), wt !== null && (li(wt), (wt = null)))),
          qa(e, t),
          Ie(t),
          null
        );
      case 5:
        _a(t);
        var l = yn(Tr.current);
        if (((n = t.type), e !== null && t.stateNode != null))
          (su(e, t, n, r, l),
            e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(o(166));
            return (Ie(t), null);
          }
          if (((e = yn(Mt.current)), Ps(t))) {
            ((r = t.stateNode), (n = t.type));
            var i = t.memoizedProps;
            switch (((r[Et] = t), (r[Cr] = i), (e = (t.mode & 1) !== 0), n)) {
              case "dialog":
                (xe("cancel", r), xe("close", r));
                break;
              case "iframe":
              case "object":
              case "embed":
                xe("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < br.length; l++) xe(br[l], r);
                break;
              case "source":
                xe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                (xe("error", r), xe("load", r));
                break;
              case "details":
                xe("toggle", r);
                break;
              case "input":
                (Oi(r, i), xe("invalid", r));
                break;
              case "select":
                ((r._wrapperState = { wasMultiple: !!i.multiple }),
                  xe("invalid", r));
                break;
              case "textarea":
                (Bi(r, i), xe("invalid", r));
            }
            (El(n, i), (l = null));
            for (var c in i)
              if (i.hasOwnProperty(c)) {
                var d = i[c];
                c === "children"
                  ? typeof d == "string"
                    ? r.textContent !== d &&
                      (i.suppressHydrationWarning !== !0 &&
                        ks(r.textContent, d, e),
                      (l = ["children", d]))
                    : typeof d == "number" &&
                      r.textContent !== "" + d &&
                      (i.suppressHydrationWarning !== !0 &&
                        ks(r.textContent, d, e),
                      (l = ["children", "" + d]))
                  : f.hasOwnProperty(c) &&
                    d != null &&
                    c === "onScroll" &&
                    xe("scroll", r);
              }
            switch (n) {
              case "input":
                (ts(r), Ii(r, i, !0));
                break;
              case "textarea":
                (ts(r), Vi(r));
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = Ss);
            }
            ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
          } else {
            ((c = l.nodeType === 9 ? l : l.ownerDocument),
              e === "http://www.w3.org/1999/xhtml" && (e = Hi(n)),
              e === "http://www.w3.org/1999/xhtml"
                ? n === "script"
                  ? ((e = c.createElement("div")),
                    (e.innerHTML = "<script><\/script>"),
                    (e = e.removeChild(e.firstChild)))
                  : typeof r.is == "string"
                    ? (e = c.createElement(n, { is: r.is }))
                    : ((e = c.createElement(n)),
                      n === "select" &&
                        ((c = e),
                        r.multiple
                          ? (c.multiple = !0)
                          : r.size && (c.size = r.size)))
                : (e = c.createElementNS(e, n)),
              (e[Et] = t),
              (e[Cr] = r),
              ru(e, t, !1, !1),
              (t.stateNode = e));
            e: {
              switch (((c = Ml(n, r)), n)) {
                case "dialog":
                  (xe("cancel", e), xe("close", e), (l = r));
                  break;
                case "iframe":
                case "object":
                case "embed":
                  (xe("load", e), (l = r));
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < br.length; l++) xe(br[l], e);
                  l = r;
                  break;
                case "source":
                  (xe("error", e), (l = r));
                  break;
                case "img":
                case "image":
                case "link":
                  (xe("error", e), xe("load", e), (l = r));
                  break;
                case "details":
                  (xe("toggle", e), (l = r));
                  break;
                case "input":
                  (Oi(e, r), (l = bl(e, r)), xe("invalid", e));
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  ((e._wrapperState = { wasMultiple: !!r.multiple }),
                    (l = U({}, r, { value: void 0 })),
                    xe("invalid", e));
                  break;
                case "textarea":
                  (Bi(e, r), (l = Cl(e, r)), xe("invalid", e));
                  break;
                default:
                  l = r;
              }
              (El(n, l), (d = l));
              for (i in d)
                if (d.hasOwnProperty(i)) {
                  var p = d[i];
                  i === "style"
                    ? Yi(e, p)
                    : i === "dangerouslySetInnerHTML"
                      ? ((p = p ? p.__html : void 0), p != null && Wi(e, p))
                      : i === "children"
                        ? typeof p == "string"
                          ? (n !== "textarea" || p !== "") && sr(e, p)
                          : typeof p == "number" && sr(e, "" + p)
                        : i !== "suppressContentEditableWarning" &&
                          i !== "suppressHydrationWarning" &&
                          i !== "autoFocus" &&
                          (f.hasOwnProperty(i)
                            ? p != null && i === "onScroll" && xe("scroll", e)
                            : p != null && le(e, i, p, c));
                }
              switch (n) {
                case "input":
                  (ts(e), Ii(e, r, !1));
                  break;
                case "textarea":
                  (ts(e), Vi(e));
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + fe(r.value));
                  break;
                case "select":
                  ((e.multiple = !!r.multiple),
                    (i = r.value),
                    i != null
                      ? zn(e, !!r.multiple, i, !1)
                      : r.defaultValue != null &&
                        zn(e, !!r.multiple, r.defaultValue, !0));
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Ss);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
        }
        return (Ie(t), null);
      case 6:
        if (e && t.stateNode != null) lu(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(o(166));
          if (((n = yn(Tr.current)), yn(Mt.current), Ps(t))) {
            if (
              ((r = t.stateNode),
              (n = t.memoizedProps),
              (r[Et] = t),
              (i = r.nodeValue !== n) && ((e = rt), e !== null))
            )
              switch (e.tag) {
                case 3:
                  ks(r.nodeValue, n, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 &&
                    ks(r.nodeValue, n, (e.mode & 1) !== 0);
              }
            i && (t.flags |= 4);
          } else
            ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
              (r[Et] = t),
              (t.stateNode = r));
        }
        return (Ie(t), null);
      case 13:
        if (
          (ge(je),
          (r = t.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (ye && st !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0)
            (oc(), Wn(), (t.flags |= 98560), (i = !1));
          else if (((i = Ps(t)), r !== null && r.dehydrated !== null)) {
            if (e === null) {
              if (!i) throw Error(o(318));
              if (
                ((i = t.memoizedState),
                (i = i !== null ? i.dehydrated : null),
                !i)
              )
                throw Error(o(317));
              i[Et] = t;
            } else
              (Wn(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (Ie(t), (i = !1));
          } else (wt !== null && (li(wt), (wt = null)), (i = !0));
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0
          ? ((t.lanes = n), t)
          : ((r = r !== null),
            r !== (e !== null && e.memoizedState !== null) &&
              r &&
              ((t.child.flags |= 8192),
              (t.mode & 1) !== 0 &&
                (e === null || (je.current & 1) !== 0
                  ? ze === 0 && (ze = 3)
                  : oi())),
            t.updateQueue !== null && (t.flags |= 4),
            Ie(t),
            null);
      case 4:
        return (
          Kn(),
          qa(e, t),
          e === null && kr(t.stateNode.containerInfo),
          Ie(t),
          null
        );
      case 10:
        return (Na(t.type._context), Ie(t), null);
      case 17:
        return (Ye(t.type) && _s(), Ie(t), null);
      case 19:
        if ((ge(je), (i = t.memoizedState), i === null)) return (Ie(t), null);
        if (((r = (t.flags & 128) !== 0), (c = i.rendering), c === null))
          if (r) Lr(i, !1);
          else {
            if (ze !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((c = Os(e)), c !== null)) {
                  for (
                    t.flags |= 128,
                      Lr(i, !1),
                      r = c.updateQueue,
                      r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      r = n,
                      n = t.child;
                    n !== null;
                  )
                    ((i = n),
                      (e = r),
                      (i.flags &= 14680066),
                      (c = i.alternate),
                      c === null
                        ? ((i.childLanes = 0),
                          (i.lanes = e),
                          (i.child = null),
                          (i.subtreeFlags = 0),
                          (i.memoizedProps = null),
                          (i.memoizedState = null),
                          (i.updateQueue = null),
                          (i.dependencies = null),
                          (i.stateNode = null))
                        : ((i.childLanes = c.childLanes),
                          (i.lanes = c.lanes),
                          (i.child = c.child),
                          (i.subtreeFlags = 0),
                          (i.deletions = null),
                          (i.memoizedProps = c.memoizedProps),
                          (i.memoizedState = c.memoizedState),
                          (i.updateQueue = c.updateQueue),
                          (i.type = c.type),
                          (e = c.dependencies),
                          (i.dependencies =
                            e === null
                              ? null
                              : {
                                  lanes: e.lanes,
                                  firstContext: e.firstContext,
                                })),
                      (n = n.sibling));
                  return (he(je, (je.current & 1) | 2), t.child);
                }
                e = e.sibling;
              }
            i.tail !== null &&
              Ce() > Zn &&
              ((t.flags |= 128), (r = !0), Lr(i, !1), (t.lanes = 4194304));
          }
        else {
          if (!r)
            if (((e = Os(c)), e !== null)) {
              if (
                ((t.flags |= 128),
                (r = !0),
                (n = e.updateQueue),
                n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                Lr(i, !0),
                i.tail === null &&
                  i.tailMode === "hidden" &&
                  !c.alternate &&
                  !ye)
              )
                return (Ie(t), null);
            } else
              2 * Ce() - i.renderingStartTime > Zn &&
                n !== 1073741824 &&
                ((t.flags |= 128), (r = !0), Lr(i, !1), (t.lanes = 4194304));
          i.isBackwards
            ? ((c.sibling = t.child), (t.child = c))
            : ((n = i.last),
              n !== null ? (n.sibling = c) : (t.child = c),
              (i.last = c));
        }
        return i.tail !== null
          ? ((t = i.tail),
            (i.rendering = t),
            (i.tail = t.sibling),
            (i.renderingStartTime = Ce()),
            (t.sibling = null),
            (n = je.current),
            he(je, r ? (n & 1) | 2 : n & 1),
            t)
          : (Ie(t), null);
      case 22:
      case 23:
        return (
          ii(),
          (r = t.memoizedState !== null),
          e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
          r && (t.mode & 1) !== 0
            ? (lt & 1073741824) !== 0 &&
              (Ie(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : Ie(t),
          null
        );
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function cp(e, t) {
    switch ((xa(t), t.tag)) {
      case 1:
        return (
          Ye(t.type) && _s(),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 3:
        return (
          Kn(),
          ge(Qe),
          ge(Oe),
          Ma(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((t.flags = (e & -65537) | 128), t)
            : null
        );
      case 5:
        return (_a(t), null);
      case 13:
        if (
          (ge(je), (e = t.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(o(340));
          Wn();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 19:
        return (ge(je), null);
      case 4:
        return (Kn(), null);
      case 10:
        return (Na(t.type._context), null);
      case 22:
      case 23:
        return (ii(), null);
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ys = !1,
    Be = !1,
    up = typeof WeakSet == "function" ? WeakSet : Set,
    I = null;
  function Xn(e, t) {
    var n = e.ref;
    if (n !== null)
      if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          Se(e, t, r);
        }
      else n.current = null;
  }
  function Ka(e, t, n) {
    try {
      n();
    } catch (r) {
      Se(e, t, r);
    }
  }
  var au = !1;
  function dp(e, t) {
    if (((ia = ms), (e = Oo()), Zl(e))) {
      if ("selectionStart" in e)
        var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var r = n.getSelection && n.getSelection();
          if (r && r.rangeCount !== 0) {
            n = r.anchorNode;
            var l = r.anchorOffset,
              i = r.focusNode;
            r = r.focusOffset;
            try {
              (n.nodeType, i.nodeType);
            } catch {
              n = null;
              break e;
            }
            var c = 0,
              d = -1,
              p = -1,
              k = 0,
              T = 0,
              A = e,
              M = null;
            t: for (;;) {
              for (
                var F;
                A !== n || (l !== 0 && A.nodeType !== 3) || (d = c + l),
                  A !== i || (r !== 0 && A.nodeType !== 3) || (p = c + r),
                  A.nodeType === 3 && (c += A.nodeValue.length),
                  (F = A.firstChild) !== null;
              )
                ((M = A), (A = F));
              for (;;) {
                if (A === e) break t;
                if (
                  (M === n && ++k === l && (d = c),
                  M === i && ++T === r && (p = c),
                  (F = A.nextSibling) !== null)
                )
                  break;
                ((A = M), (M = A.parentNode));
              }
              A = F;
            }
            n = d === -1 || p === -1 ? null : { start: d, end: p };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (
      oa = { focusedElem: e, selectionRange: n }, ms = !1, I = t;
      I !== null;
    )
      if (((t = I), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
        ((e.return = t), (I = e));
      else
        for (; I !== null; ) {
          t = I;
          try {
            var V = t.alternate;
            if ((t.flags & 1024) !== 0)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (V !== null) {
                    var H = V.memoizedProps,
                      _e = V.memoizedState,
                      w = t.stateNode,
                      x = w.getSnapshotBeforeUpdate(
                        t.elementType === t.type ? H : jt(t.type, H),
                        _e,
                      );
                    w.__reactInternalSnapshotBeforeUpdate = x;
                  }
                  break;
                case 3:
                  var b = t.stateNode.containerInfo;
                  b.nodeType === 1
                    ? (b.textContent = "")
                    : b.nodeType === 9 &&
                      b.documentElement &&
                      b.removeChild(b.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(o(163));
              }
          } catch (L) {
            Se(t, t.return, L);
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (I = e));
            break;
          }
          I = t.return;
        }
    return ((V = au), (au = !1), V);
  }
  function $r(e, t, n) {
    var r = t.updateQueue;
    if (((r = r !== null ? r.lastEffect : null), r !== null)) {
      var l = (r = r.next);
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          ((l.destroy = void 0), i !== void 0 && Ka(t, n, i));
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function qs(e, t) {
    if (
      ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
    ) {
      var n = (t = t.next);
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function Ga(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : (t.current = e);
    }
  }
  function iu(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), iu(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 &&
        ((t = e.stateNode),
        t !== null &&
          (delete t[Et],
          delete t[Cr],
          delete t[fa],
          delete t[Ym],
          delete t[qm])),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  function ou(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function cu(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || ou(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Xa(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
      ((e = e.stateNode),
        t
          ? n.nodeType === 8
            ? n.parentNode.insertBefore(e, t)
            : n.insertBefore(e, t)
          : (n.nodeType === 8
              ? ((t = n.parentNode), t.insertBefore(e, n))
              : ((t = n), t.appendChild(e)),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = Ss)));
    else if (r !== 4 && ((e = e.child), e !== null))
      for (Xa(e, t, n), e = e.sibling; e !== null; )
        (Xa(e, t, n), (e = e.sibling));
  }
  function Ja(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
      ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (r !== 4 && ((e = e.child), e !== null))
      for (Ja(e, t, n), e = e.sibling; e !== null; )
        (Ja(e, t, n), (e = e.sibling));
  }
  var De = null,
    Nt = !1;
  function sn(e, t, n) {
    for (n = n.child; n !== null; ) (uu(e, t, n), (n = n.sibling));
  }
  function uu(e, t, n) {
    if (_t && typeof _t.onCommitFiberUnmount == "function")
      try {
        _t.onCommitFiberUnmount(is, n);
      } catch {}
    switch (n.tag) {
      case 5:
        Be || Xn(n, t);
      case 6:
        var r = De,
          l = Nt;
        ((De = null),
          sn(e, t, n),
          (De = r),
          (Nt = l),
          De !== null &&
            (Nt
              ? ((e = De),
                (n = n.stateNode),
                e.nodeType === 8
                  ? e.parentNode.removeChild(n)
                  : e.removeChild(n))
              : De.removeChild(n.stateNode)));
        break;
      case 18:
        De !== null &&
          (Nt
            ? ((e = De),
              (n = n.stateNode),
              e.nodeType === 8
                ? da(e.parentNode, n)
                : e.nodeType === 1 && da(e, n),
              hr(e))
            : da(De, n.stateNode));
        break;
      case 4:
        ((r = De),
          (l = Nt),
          (De = n.stateNode.containerInfo),
          (Nt = !0),
          sn(e, t, n),
          (De = r),
          (Nt = l));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (
          !Be &&
          ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
        ) {
          l = r = r.next;
          do {
            var i = l,
              c = i.destroy;
            ((i = i.tag),
              c !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && Ka(n, t, c),
              (l = l.next));
          } while (l !== r);
        }
        sn(e, t, n);
        break;
      case 1:
        if (
          !Be &&
          (Xn(n, t),
          (r = n.stateNode),
          typeof r.componentWillUnmount == "function")
        )
          try {
            ((r.props = n.memoizedProps),
              (r.state = n.memoizedState),
              r.componentWillUnmount());
          } catch (d) {
            Se(n, t, d);
          }
        sn(e, t, n);
        break;
      case 21:
        sn(e, t, n);
        break;
      case 22:
        n.mode & 1
          ? ((Be = (r = Be) || n.memoizedState !== null), sn(e, t, n), (Be = r))
          : sn(e, t, n);
        break;
      default:
        sn(e, t, n);
    }
  }
  function du(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      (n === null && (n = e.stateNode = new up()),
        t.forEach(function (r) {
          var l = wp.bind(null, e, r);
          n.has(r) || (n.add(r), r.then(l, l));
        }));
    }
  }
  function bt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var r = 0; r < n.length; r++) {
        var l = n[r];
        try {
          var i = e,
            c = t,
            d = c;
          e: for (; d !== null; ) {
            switch (d.tag) {
              case 5:
                ((De = d.stateNode), (Nt = !1));
                break e;
              case 3:
                ((De = d.stateNode.containerInfo), (Nt = !0));
                break e;
              case 4:
                ((De = d.stateNode.containerInfo), (Nt = !0));
                break e;
            }
            d = d.return;
          }
          if (De === null) throw Error(o(160));
          (uu(i, c, l), (De = null), (Nt = !1));
          var p = l.alternate;
          (p !== null && (p.return = null), (l.return = null));
        } catch (k) {
          Se(l, t, k);
        }
      }
    if (t.subtreeFlags & 12854)
      for (t = t.child; t !== null; ) (fu(t, e), (t = t.sibling));
  }
  function fu(e, t) {
    var n = e.alternate,
      r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((bt(t, e), Tt(e), r & 4)) {
          try {
            ($r(3, e, e.return), qs(3, e));
          } catch (H) {
            Se(e, e.return, H);
          }
          try {
            $r(5, e, e.return);
          } catch (H) {
            Se(e, e.return, H);
          }
        }
        break;
      case 1:
        (bt(t, e), Tt(e), r & 512 && n !== null && Xn(n, n.return));
        break;
      case 5:
        if (
          (bt(t, e),
          Tt(e),
          r & 512 && n !== null && Xn(n, n.return),
          e.flags & 32)
        ) {
          var l = e.stateNode;
          try {
            sr(l, "");
          } catch (H) {
            Se(e, e.return, H);
          }
        }
        if (r & 4 && ((l = e.stateNode), l != null)) {
          var i = e.memoizedProps,
            c = n !== null ? n.memoizedProps : i,
            d = e.type,
            p = e.updateQueue;
          if (((e.updateQueue = null), p !== null))
            try {
              (d === "input" &&
                i.type === "radio" &&
                i.name != null &&
                Fi(l, i),
                Ml(d, c));
              var k = Ml(d, i);
              for (c = 0; c < p.length; c += 2) {
                var T = p[c],
                  A = p[c + 1];
                T === "style"
                  ? Yi(l, A)
                  : T === "dangerouslySetInnerHTML"
                    ? Wi(l, A)
                    : T === "children"
                      ? sr(l, A)
                      : le(l, T, A, k);
              }
              switch (d) {
                case "input":
                  kl(l, i);
                  break;
                case "textarea":
                  Ui(l, i);
                  break;
                case "select":
                  var M = l._wrapperState.wasMultiple;
                  l._wrapperState.wasMultiple = !!i.multiple;
                  var F = i.value;
                  F != null
                    ? zn(l, !!i.multiple, F, !1)
                    : M !== !!i.multiple &&
                      (i.defaultValue != null
                        ? zn(l, !!i.multiple, i.defaultValue, !0)
                        : zn(l, !!i.multiple, i.multiple ? [] : "", !1));
              }
              l[Cr] = i;
            } catch (H) {
              Se(e, e.return, H);
            }
        }
        break;
      case 6:
        if ((bt(t, e), Tt(e), r & 4)) {
          if (e.stateNode === null) throw Error(o(162));
          ((l = e.stateNode), (i = e.memoizedProps));
          try {
            l.nodeValue = i;
          } catch (H) {
            Se(e, e.return, H);
          }
        }
        break;
      case 3:
        if (
          (bt(t, e), Tt(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            hr(t.containerInfo);
          } catch (H) {
            Se(e, e.return, H);
          }
        break;
      case 4:
        (bt(t, e), Tt(e));
        break;
      case 13:
        (bt(t, e),
          Tt(e),
          (l = e.child),
          l.flags & 8192 &&
            ((i = l.memoizedState !== null),
            (l.stateNode.isHidden = i),
            !i ||
              (l.alternate !== null && l.alternate.memoizedState !== null) ||
              (ti = Ce())),
          r & 4 && du(e));
        break;
      case 22:
        if (
          ((T = n !== null && n.memoizedState !== null),
          e.mode & 1 ? ((Be = (k = Be) || T), bt(t, e), (Be = k)) : bt(t, e),
          Tt(e),
          r & 8192)
        ) {
          if (
            ((k = e.memoizedState !== null),
            (e.stateNode.isHidden = k) && !T && (e.mode & 1) !== 0)
          )
            for (I = e, T = e.child; T !== null; ) {
              for (A = I = T; I !== null; ) {
                switch (((M = I), (F = M.child), M.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    $r(4, M, M.return);
                    break;
                  case 1:
                    Xn(M, M.return);
                    var V = M.stateNode;
                    if (typeof V.componentWillUnmount == "function") {
                      ((r = M), (n = M.return));
                      try {
                        ((t = r),
                          (V.props = t.memoizedProps),
                          (V.state = t.memoizedState),
                          V.componentWillUnmount());
                      } catch (H) {
                        Se(r, n, H);
                      }
                    }
                    break;
                  case 5:
                    Xn(M, M.return);
                    break;
                  case 22:
                    if (M.memoizedState !== null) {
                      hu(A);
                      continue;
                    }
                }
                F !== null ? ((F.return = M), (I = F)) : hu(A);
              }
              T = T.sibling;
            }
          e: for (T = null, A = e; ; ) {
            if (A.tag === 5) {
              if (T === null) {
                T = A;
                try {
                  ((l = A.stateNode),
                    k
                      ? ((i = l.style),
                        typeof i.setProperty == "function"
                          ? i.setProperty("display", "none", "important")
                          : (i.display = "none"))
                      : ((d = A.stateNode),
                        (p = A.memoizedProps.style),
                        (c =
                          p != null && p.hasOwnProperty("display")
                            ? p.display
                            : null),
                        (d.style.display = Qi("display", c))));
                } catch (H) {
                  Se(e, e.return, H);
                }
              }
            } else if (A.tag === 6) {
              if (T === null)
                try {
                  A.stateNode.nodeValue = k ? "" : A.memoizedProps;
                } catch (H) {
                  Se(e, e.return, H);
                }
            } else if (
              ((A.tag !== 22 && A.tag !== 23) ||
                A.memoizedState === null ||
                A === e) &&
              A.child !== null
            ) {
              ((A.child.return = A), (A = A.child));
              continue;
            }
            if (A === e) break e;
            for (; A.sibling === null; ) {
              if (A.return === null || A.return === e) break e;
              (T === A && (T = null), (A = A.return));
            }
            (T === A && (T = null),
              (A.sibling.return = A.return),
              (A = A.sibling));
          }
        }
        break;
      case 19:
        (bt(t, e), Tt(e), r & 4 && du(e));
        break;
      case 21:
        break;
      default:
        (bt(t, e), Tt(e));
    }
  }
  function Tt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (ou(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(o(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (sr(l, ""), (r.flags &= -33));
            var i = cu(e);
            Ja(e, i, l);
            break;
          case 3:
          case 4:
            var c = r.stateNode.containerInfo,
              d = cu(e);
            Xa(e, d, c);
            break;
          default:
            throw Error(o(161));
        }
      } catch (p) {
        Se(e, e.return, p);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function fp(e, t, n) {
    ((I = e), mu(e));
  }
  function mu(e, t, n) {
    for (var r = (e.mode & 1) !== 0; I !== null; ) {
      var l = I,
        i = l.child;
      if (l.tag === 22 && r) {
        var c = l.memoizedState !== null || Ys;
        if (!c) {
          var d = l.alternate,
            p = (d !== null && d.memoizedState !== null) || Be;
          d = Ys;
          var k = Be;
          if (((Ys = c), (Be = p) && !k))
            for (I = l; I !== null; )
              ((c = I),
                (p = c.child),
                c.tag === 22 && c.memoizedState !== null
                  ? xu(l)
                  : p !== null
                    ? ((p.return = c), (I = p))
                    : xu(l));
          for (; i !== null; ) ((I = i), mu(i), (i = i.sibling));
          ((I = l), (Ys = d), (Be = k));
        }
        pu(e);
      } else
        (l.subtreeFlags & 8772) !== 0 && i !== null
          ? ((i.return = l), (I = i))
          : pu(e);
    }
  }
  function pu(e) {
    for (; I !== null; ) {
      var t = I;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                Be || qs(5, t);
                break;
              case 1:
                var r = t.stateNode;
                if (t.flags & 4 && !Be)
                  if (n === null) r.componentDidMount();
                  else {
                    var l =
                      t.elementType === t.type
                        ? n.memoizedProps
                        : jt(t.type, n.memoizedProps);
                    r.componentDidUpdate(
                      l,
                      n.memoizedState,
                      r.__reactInternalSnapshotBeforeUpdate,
                    );
                  }
                var i = t.updateQueue;
                i !== null && hc(t, i, r);
                break;
              case 3:
                var c = t.updateQueue;
                if (c !== null) {
                  if (((n = null), t.child !== null))
                    switch (t.child.tag) {
                      case 5:
                        n = t.child.stateNode;
                        break;
                      case 1:
                        n = t.child.stateNode;
                    }
                  hc(t, c, n);
                }
                break;
              case 5:
                var d = t.stateNode;
                if (n === null && t.flags & 4) {
                  n = d;
                  var p = t.memoizedProps;
                  switch (t.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      p.autoFocus && n.focus();
                      break;
                    case "img":
                      p.src && (n.src = p.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (t.memoizedState === null) {
                  var k = t.alternate;
                  if (k !== null) {
                    var T = k.memoizedState;
                    if (T !== null) {
                      var A = T.dehydrated;
                      A !== null && hr(A);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(o(163));
            }
          Be || (t.flags & 512 && Ga(t));
        } catch (M) {
          Se(t, t.return, M);
        }
      }
      if (t === e) {
        I = null;
        break;
      }
      if (((n = t.sibling), n !== null)) {
        ((n.return = t.return), (I = n));
        break;
      }
      I = t.return;
    }
  }
  function hu(e) {
    for (; I !== null; ) {
      var t = I;
      if (t === e) {
        I = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        ((n.return = t.return), (I = n));
        break;
      }
      I = t.return;
    }
  }
  function xu(e) {
    for (; I !== null; ) {
      var t = I;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              qs(4, t);
            } catch (p) {
              Se(t, n, p);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (p) {
                Se(t, l, p);
              }
            }
            var i = t.return;
            try {
              Ga(t);
            } catch (p) {
              Se(t, i, p);
            }
            break;
          case 5:
            var c = t.return;
            try {
              Ga(t);
            } catch (p) {
              Se(t, c, p);
            }
        }
      } catch (p) {
        Se(t, t.return, p);
      }
      if (t === e) {
        I = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        ((d.return = t.return), (I = d));
        break;
      }
      I = t.return;
    }
  }
  var mp = Math.ceil,
    Ks = Z.ReactCurrentDispatcher,
    Za = Z.ReactCurrentOwner,
    dt = Z.ReactCurrentBatchConfig,
    ae = 0,
    Re = null,
    Ee = null,
    Le = 0,
    lt = 0,
    Jn = Zt(0),
    ze = 0,
    Or = null,
    jn = 0,
    Gs = 0,
    ei = 0,
    Fr = null,
    Ke = null,
    ti = 0,
    Zn = 1 / 0,
    Wt = null,
    Xs = !1,
    ni = null,
    ln = null,
    Js = !1,
    an = null,
    Zs = 0,
    Ir = 0,
    ri = null,
    el = -1,
    tl = 0;
  function Ve() {
    return (ae & 6) !== 0 ? Ce() : el !== -1 ? el : (el = Ce());
  }
  function on(e) {
    return (e.mode & 1) === 0
      ? 1
      : (ae & 2) !== 0 && Le !== 0
        ? Le & -Le
        : Gm.transition !== null
          ? (tl === 0 && (tl = oo()), tl)
          : ((e = me),
            e !== 0 ||
              ((e = window.event), (e = e === void 0 ? 16 : vo(e.type))),
            e);
  }
  function kt(e, t, n, r) {
    if (50 < Ir) throw ((Ir = 0), (ri = null), Error(o(185)));
    (ur(e, n, r),
      ((ae & 2) === 0 || e !== Re) &&
        (e === Re && ((ae & 2) === 0 && (Gs |= n), ze === 4 && cn(e, Le)),
        Ge(e, r),
        n === 1 &&
          ae === 0 &&
          (t.mode & 1) === 0 &&
          ((Zn = Ce() + 500), Ms && tn())));
  }
  function Ge(e, t) {
    var n = e.callbackNode;
    Gf(e, t);
    var r = us(e, e === Re ? Le : 0);
    if (r === 0)
      (n !== null && lo(n), (e.callbackNode = null), (e.callbackPriority = 0));
    else if (((t = r & -r), e.callbackPriority !== t)) {
      if ((n != null && lo(n), t === 1))
        (e.tag === 0 ? Km(vu.bind(null, e)) : rc(vu.bind(null, e)),
          Wm(function () {
            (ae & 6) === 0 && tn();
          }),
          (n = null));
      else {
        switch (co(r)) {
          case 1:
            n = Ll;
            break;
          case 4:
            n = ao;
            break;
          case 16:
            n = as;
            break;
          case 536870912:
            n = io;
            break;
          default:
            n = as;
        }
        n = Cu(n, gu.bind(null, e));
      }
      ((e.callbackPriority = t), (e.callbackNode = n));
    }
  }
  function gu(e, t) {
    if (((el = -1), (tl = 0), (ae & 6) !== 0)) throw Error(o(327));
    var n = e.callbackNode;
    if (er() && e.callbackNode !== n) return null;
    var r = us(e, e === Re ? Le : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = nl(e, r);
    else {
      t = r;
      var l = ae;
      ae |= 2;
      var i = wu();
      (Re !== e || Le !== t) && ((Wt = null), (Zn = Ce() + 500), bn(e, t));
      do
        try {
          xp();
          break;
        } catch (d) {
          yu(e, d);
        }
      while (!0);
      (ja(),
        (Ks.current = i),
        (ae = l),
        Ee !== null ? (t = 0) : ((Re = null), (Le = 0), (t = ze)));
    }
    if (t !== 0) {
      if (
        (t === 2 && ((l = $l(e)), l !== 0 && ((r = l), (t = si(e, l)))),
        t === 1)
      )
        throw ((n = Or), bn(e, 0), cn(e, r), Ge(e, Ce()), n);
      if (t === 6) cn(e, r);
      else {
        if (
          ((l = e.current.alternate),
          (r & 30) === 0 &&
            !pp(l) &&
            ((t = nl(e, r)),
            t === 2 && ((i = $l(e)), i !== 0 && ((r = i), (t = si(e, i)))),
            t === 1))
        )
          throw ((n = Or), bn(e, 0), cn(e, r), Ge(e, Ce()), n);
        switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
          case 0:
          case 1:
            throw Error(o(345));
          case 2:
            kn(e, Ke, Wt);
            break;
          case 3:
            if (
              (cn(e, r),
              (r & 130023424) === r && ((t = ti + 500 - Ce()), 10 < t))
            ) {
              if (us(e, 0) !== 0) break;
              if (((l = e.suspendedLanes), (l & r) !== r)) {
                (Ve(), (e.pingedLanes |= e.suspendedLanes & l));
                break;
              }
              e.timeoutHandle = ua(kn.bind(null, e, Ke, Wt), t);
              break;
            }
            kn(e, Ke, Wt);
            break;
          case 4:
            if ((cn(e, r), (r & 4194240) === r)) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var c = 31 - vt(r);
              ((i = 1 << c), (c = t[c]), c > l && (l = c), (r &= ~i));
            }
            if (
              ((r = l),
              (r = Ce() - r),
              (r =
                (120 > r
                  ? 120
                  : 480 > r
                    ? 480
                    : 1080 > r
                      ? 1080
                      : 1920 > r
                        ? 1920
                        : 3e3 > r
                          ? 3e3
                          : 4320 > r
                            ? 4320
                            : 1960 * mp(r / 1960)) - r),
              10 < r)
            ) {
              e.timeoutHandle = ua(kn.bind(null, e, Ke, Wt), r);
              break;
            }
            kn(e, Ke, Wt);
            break;
          case 5:
            kn(e, Ke, Wt);
            break;
          default:
            throw Error(o(329));
        }
      }
    }
    return (Ge(e, Ce()), e.callbackNode === n ? gu.bind(null, e) : null);
  }
  function si(e, t) {
    var n = Fr;
    return (
      e.current.memoizedState.isDehydrated && (bn(e, t).flags |= 256),
      (e = nl(e, t)),
      e !== 2 && ((t = Ke), (Ke = n), t !== null && li(t)),
      e
    );
  }
  function li(e) {
    Ke === null ? (Ke = e) : Ke.push.apply(Ke, e);
  }
  function pp(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && ((n = n.stores), n !== null))
          for (var r = 0; r < n.length; r++) {
            var l = n[r],
              i = l.getSnapshot;
            l = l.value;
            try {
              if (!yt(i(), l)) return !1;
            } catch {
              return !1;
            }
          }
      }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
        ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function cn(e, t) {
    for (
      t &= ~ei,
        t &= ~Gs,
        e.suspendedLanes |= t,
        e.pingedLanes &= ~t,
        e = e.expirationTimes;
      0 < t;
    ) {
      var n = 31 - vt(t),
        r = 1 << n;
      ((e[n] = -1), (t &= ~r));
    }
  }
  function vu(e) {
    if ((ae & 6) !== 0) throw Error(o(327));
    er();
    var t = us(e, 0);
    if ((t & 1) === 0) return (Ge(e, Ce()), null);
    var n = nl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = $l(e);
      r !== 0 && ((t = r), (n = si(e, r)));
    }
    if (n === 1) throw ((n = Or), bn(e, 0), cn(e, t), Ge(e, Ce()), n);
    if (n === 6) throw Error(o(345));
    return (
      (e.finishedWork = e.current.alternate),
      (e.finishedLanes = t),
      kn(e, Ke, Wt),
      Ge(e, Ce()),
      null
    );
  }
  function ai(e, t) {
    var n = ae;
    ae |= 1;
    try {
      return e(t);
    } finally {
      ((ae = n), ae === 0 && ((Zn = Ce() + 500), Ms && tn()));
    }
  }
  function Nn(e) {
    an !== null && an.tag === 0 && (ae & 6) === 0 && er();
    var t = ae;
    ae |= 1;
    var n = dt.transition,
      r = me;
    try {
      if (((dt.transition = null), (me = 1), e)) return e();
    } finally {
      ((me = r), (dt.transition = n), (ae = t), (ae & 6) === 0 && tn());
    }
  }
  function ii() {
    ((lt = Jn.current), ge(Jn));
  }
  function bn(e, t) {
    ((e.finishedWork = null), (e.finishedLanes = 0));
    var n = e.timeoutHandle;
    if ((n !== -1 && ((e.timeoutHandle = -1), Hm(n)), Ee !== null))
      for (n = Ee.return; n !== null; ) {
        var r = n;
        switch ((xa(r), r.tag)) {
          case 1:
            ((r = r.type.childContextTypes), r != null && _s());
            break;
          case 3:
            (Kn(), ge(Qe), ge(Oe), Ma());
            break;
          case 5:
            _a(r);
            break;
          case 4:
            Kn();
            break;
          case 13:
            ge(je);
            break;
          case 19:
            ge(je);
            break;
          case 10:
            Na(r.type._context);
            break;
          case 22:
          case 23:
            ii();
        }
        n = n.return;
      }
    if (
      ((Re = e),
      (Ee = e = un(e.current, null)),
      (Le = lt = t),
      (ze = 0),
      (Or = null),
      (ei = Gs = jn = 0),
      (Ke = Fr = null),
      vn !== null)
    ) {
      for (t = 0; t < vn.length; t++)
        if (((n = vn[t]), (r = n.interleaved), r !== null)) {
          n.interleaved = null;
          var l = r.next,
            i = n.pending;
          if (i !== null) {
            var c = i.next;
            ((i.next = l), (r.next = c));
          }
          n.pending = r;
        }
      vn = null;
    }
    return e;
  }
  function yu(e, t) {
    do {
      var n = Ee;
      try {
        if ((ja(), (Fs.current = Vs), Is)) {
          for (var r = Ne.memoizedState; r !== null; ) {
            var l = r.queue;
            (l !== null && (l.pending = null), (r = r.next));
          }
          Is = !1;
        }
        if (
          ((wn = 0),
          (Pe = Me = Ne = null),
          (Pr = !1),
          (Rr = 0),
          (Za.current = null),
          n === null || n.return === null)
        ) {
          ((ze = 1), (Or = t), (Ee = null));
          break;
        }
        e: {
          var i = e,
            c = n.return,
            d = n,
            p = t;
          if (
            ((t = Le),
            (d.flags |= 32768),
            p !== null && typeof p == "object" && typeof p.then == "function")
          ) {
            var k = p,
              T = d,
              A = T.tag;
            if ((T.mode & 1) === 0 && (A === 0 || A === 11 || A === 15)) {
              var M = T.alternate;
              M
                ? ((T.updateQueue = M.updateQueue),
                  (T.memoizedState = M.memoizedState),
                  (T.lanes = M.lanes))
                : ((T.updateQueue = null), (T.memoizedState = null));
            }
            var F = Hc(c);
            if (F !== null) {
              ((F.flags &= -257),
                Wc(F, c, d, i, t),
                F.mode & 1 && Vc(i, k, t),
                (t = F),
                (p = k));
              var V = t.updateQueue;
              if (V === null) {
                var H = new Set();
                (H.add(p), (t.updateQueue = H));
              } else V.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                (Vc(i, k, t), oi());
                break e;
              }
              p = Error(o(426));
            }
          } else if (ye && d.mode & 1) {
            var _e = Hc(c);
            if (_e !== null) {
              ((_e.flags & 65536) === 0 && (_e.flags |= 256),
                Wc(_e, c, d, i, t),
                ya(Gn(p, d)));
              break e;
            }
          }
          ((i = p = Gn(p, d)),
            ze !== 4 && (ze = 2),
            Fr === null ? (Fr = [i]) : Fr.push(i),
            (i = c));
          do {
            switch (i.tag) {
              case 3:
                ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                var w = Bc(i, p, t);
                pc(i, w);
                break e;
              case 1:
                d = p;
                var x = i.type,
                  b = i.stateNode;
                if (
                  (i.flags & 128) === 0 &&
                  (typeof x.getDerivedStateFromError == "function" ||
                    (b !== null &&
                      typeof b.componentDidCatch == "function" &&
                      (ln === null || !ln.has(b))))
                ) {
                  ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                  var L = Uc(i, d, t);
                  pc(i, L);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Nu(n);
      } catch (W) {
        ((t = W), Ee === n && n !== null && (Ee = n = n.return));
        continue;
      }
      break;
    } while (!0);
  }
  function wu() {
    var e = Ks.current;
    return ((Ks.current = Vs), e === null ? Vs : e);
  }
  function oi() {
    ((ze === 0 || ze === 3 || ze === 2) && (ze = 4),
      Re === null ||
        ((jn & 268435455) === 0 && (Gs & 268435455) === 0) ||
        cn(Re, Le));
  }
  function nl(e, t) {
    var n = ae;
    ae |= 2;
    var r = wu();
    (Re !== e || Le !== t) && ((Wt = null), bn(e, t));
    do
      try {
        hp();
        break;
      } catch (l) {
        yu(e, l);
      }
    while (!0);
    if ((ja(), (ae = n), (Ks.current = r), Ee !== null)) throw Error(o(261));
    return ((Re = null), (Le = 0), ze);
  }
  function hp() {
    for (; Ee !== null; ) ju(Ee);
  }
  function xp() {
    for (; Ee !== null && !Bf(); ) ju(Ee);
  }
  function ju(e) {
    var t = Su(e.alternate, e, lt);
    ((e.memoizedProps = e.pendingProps),
      t === null ? Nu(e) : (Ee = t),
      (Za.current = null));
  }
  function Nu(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (((e = t.return), (t.flags & 32768) === 0)) {
        if (((n = op(n, t, lt)), n !== null)) {
          Ee = n;
          return;
        }
      } else {
        if (((n = cp(n, t)), n !== null)) {
          ((n.flags &= 32767), (Ee = n));
          return;
        }
        if (e !== null)
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
        else {
          ((ze = 6), (Ee = null));
          return;
        }
      }
      if (((t = t.sibling), t !== null)) {
        Ee = t;
        return;
      }
      Ee = t = e;
    } while (t !== null);
    ze === 0 && (ze = 5);
  }
  function kn(e, t, n) {
    var r = me,
      l = dt.transition;
    try {
      ((dt.transition = null), (me = 1), gp(e, t, n, r));
    } finally {
      ((dt.transition = l), (me = r));
    }
    return null;
  }
  function gp(e, t, n, r) {
    do er();
    while (an !== null);
    if ((ae & 6) !== 0) throw Error(o(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
      throw Error(o(177));
    ((e.callbackNode = null), (e.callbackPriority = 0));
    var i = n.lanes | n.childLanes;
    if (
      (Xf(e, i),
      e === Re && ((Ee = Re = null), (Le = 0)),
      ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
        Js ||
        ((Js = !0),
        Cu(as, function () {
          return (er(), null);
        })),
      (i = (n.flags & 15990) !== 0),
      (n.subtreeFlags & 15990) !== 0 || i)
    ) {
      ((i = dt.transition), (dt.transition = null));
      var c = me;
      me = 1;
      var d = ae;
      ((ae |= 4),
        (Za.current = null),
        dp(e, n),
        fu(n, e),
        $m(oa),
        (ms = !!ia),
        (oa = ia = null),
        (e.current = n),
        fp(n),
        Uf(),
        (ae = d),
        (me = c),
        (dt.transition = i));
    } else e.current = n;
    if (
      (Js && ((Js = !1), (an = e), (Zs = l)),
      (i = e.pendingLanes),
      i === 0 && (ln = null),
      Wf(n.stateNode),
      Ge(e, Ce()),
      t !== null)
    )
      for (r = e.onRecoverableError, n = 0; n < t.length; n++)
        ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
    if (Xs) throw ((Xs = !1), (e = ni), (ni = null), e);
    return (
      (Zs & 1) !== 0 && e.tag !== 0 && er(),
      (i = e.pendingLanes),
      (i & 1) !== 0 ? (e === ri ? Ir++ : ((Ir = 0), (ri = e))) : (Ir = 0),
      tn(),
      null
    );
  }
  function er() {
    if (an !== null) {
      var e = co(Zs),
        t = dt.transition,
        n = me;
      try {
        if (((dt.transition = null), (me = 16 > e ? 16 : e), an === null))
          var r = !1;
        else {
          if (((e = an), (an = null), (Zs = 0), (ae & 6) !== 0))
            throw Error(o(331));
          var l = ae;
          for (ae |= 4, I = e.current; I !== null; ) {
            var i = I,
              c = i.child;
            if ((I.flags & 16) !== 0) {
              var d = i.deletions;
              if (d !== null) {
                for (var p = 0; p < d.length; p++) {
                  var k = d[p];
                  for (I = k; I !== null; ) {
                    var T = I;
                    switch (T.tag) {
                      case 0:
                      case 11:
                      case 15:
                        $r(8, T, i);
                    }
                    var A = T.child;
                    if (A !== null) ((A.return = T), (I = A));
                    else
                      for (; I !== null; ) {
                        T = I;
                        var M = T.sibling,
                          F = T.return;
                        if ((iu(T), T === k)) {
                          I = null;
                          break;
                        }
                        if (M !== null) {
                          ((M.return = F), (I = M));
                          break;
                        }
                        I = F;
                      }
                  }
                }
                var V = i.alternate;
                if (V !== null) {
                  var H = V.child;
                  if (H !== null) {
                    V.child = null;
                    do {
                      var _e = H.sibling;
                      ((H.sibling = null), (H = _e));
                    } while (H !== null);
                  }
                }
                I = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && c !== null)
              ((c.return = i), (I = c));
            else
              e: for (; I !== null; ) {
                if (((i = I), (i.flags & 2048) !== 0))
                  switch (i.tag) {
                    case 0:
                    case 11:
                    case 15:
                      $r(9, i, i.return);
                  }
                var w = i.sibling;
                if (w !== null) {
                  ((w.return = i.return), (I = w));
                  break e;
                }
                I = i.return;
              }
          }
          var x = e.current;
          for (I = x; I !== null; ) {
            c = I;
            var b = c.child;
            if ((c.subtreeFlags & 2064) !== 0 && b !== null)
              ((b.return = c), (I = b));
            else
              e: for (c = x; I !== null; ) {
                if (((d = I), (d.flags & 2048) !== 0))
                  try {
                    switch (d.tag) {
                      case 0:
                      case 11:
                      case 15:
                        qs(9, d);
                    }
                  } catch (W) {
                    Se(d, d.return, W);
                  }
                if (d === c) {
                  I = null;
                  break e;
                }
                var L = d.sibling;
                if (L !== null) {
                  ((L.return = d.return), (I = L));
                  break e;
                }
                I = d.return;
              }
          }
          if (
            ((ae = l),
            tn(),
            _t && typeof _t.onPostCommitFiberRoot == "function")
          )
            try {
              _t.onPostCommitFiberRoot(is, e);
            } catch {}
          r = !0;
        }
        return r;
      } finally {
        ((me = n), (dt.transition = t));
      }
    }
    return !1;
  }
  function bu(e, t, n) {
    ((t = Gn(n, t)),
      (t = Bc(e, t, 1)),
      (e = rn(e, t, 1)),
      (t = Ve()),
      e !== null && (ur(e, 1, t), Ge(e, t)));
  }
  function Se(e, t, n) {
    if (e.tag === 3) bu(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          bu(t, e, n);
          break;
        } else if (t.tag === 1) {
          var r = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof r.componentDidCatch == "function" &&
              (ln === null || !ln.has(r)))
          ) {
            ((e = Gn(n, e)),
              (e = Uc(t, e, 1)),
              (t = rn(t, e, 1)),
              (e = Ve()),
              t !== null && (ur(t, 1, e), Ge(t, e)));
            break;
          }
        }
        t = t.return;
      }
  }
  function vp(e, t, n) {
    var r = e.pingCache;
    (r !== null && r.delete(t),
      (t = Ve()),
      (e.pingedLanes |= e.suspendedLanes & n),
      Re === e &&
        (Le & n) === n &&
        (ze === 4 || (ze === 3 && (Le & 130023424) === Le && 500 > Ce() - ti)
          ? bn(e, 0)
          : (ei |= n)),
      Ge(e, t));
  }
  function ku(e, t) {
    t === 0 &&
      ((e.mode & 1) === 0
        ? (t = 1)
        : ((t = cs), (cs <<= 1), (cs & 130023424) === 0 && (cs = 4194304)));
    var n = Ve();
    ((e = Ut(e, t)), e !== null && (ur(e, t, n), Ge(e, n)));
  }
  function yp(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), ku(e, n));
  }
  function wp(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode,
          l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(o(314));
    }
    (r !== null && r.delete(t), ku(e, n));
  }
  var Su;
  Su = function (e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps || Qe.current) qe = !0;
      else {
        if ((e.lanes & n) === 0 && (t.flags & 128) === 0)
          return ((qe = !1), ip(e, t, n));
        qe = (e.flags & 131072) !== 0;
      }
    else ((qe = !1), ye && (t.flags & 1048576) !== 0 && sc(t, Ts, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var r = t.type;
        (Qs(e, t), (e = t.pendingProps));
        var l = Un(t, Oe.current);
        (qn(t, n), (l = Pa(null, t, r, e, l, n)));
        var i = Ra();
        return (
          (t.flags |= 1),
          typeof l == "object" &&
          l !== null &&
          typeof l.render == "function" &&
          l.$$typeof === void 0
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              Ye(r) ? ((i = !0), Es(t)) : (i = !1),
              (t.memoizedState =
                l.state !== null && l.state !== void 0 ? l.state : null),
              Sa(t),
              (l.updater = Hs),
              (t.stateNode = l),
              (l._reactInternals = t),
              Fa(t, r, e, n),
              (t = Va(null, t, r, !0, i, n)))
            : ((t.tag = 0), ye && i && ha(t), Ue(null, t, l, n), (t = t.child)),
          t
        );
      case 16:
        r = t.elementType;
        e: {
          switch (
            (Qs(e, t),
            (e = t.pendingProps),
            (l = r._init),
            (r = l(r._payload)),
            (t.type = r),
            (l = t.tag = Np(r)),
            (e = jt(r, e)),
            l)
          ) {
            case 0:
              t = Ua(null, t, r, e, n);
              break e;
            case 1:
              t = Xc(null, t, r, e, n);
              break e;
            case 11:
              t = Qc(null, t, r, e, n);
              break e;
            case 14:
              t = Yc(null, t, r, jt(r.type, e), n);
              break e;
          }
          throw Error(o(306, r, ""));
        }
        return t;
      case 0:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : jt(r, l)),
          Ua(e, t, r, l, n)
        );
      case 1:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : jt(r, l)),
          Xc(e, t, r, l, n)
        );
      case 3:
        e: {
          if ((Jc(t), e === null)) throw Error(o(387));
          ((r = t.pendingProps),
            (i = t.memoizedState),
            (l = i.element),
            mc(e, t),
            $s(t, r, null, n));
          var c = t.memoizedState;
          if (((r = c.element), i.isDehydrated))
            if (
              ((i = {
                element: r,
                isDehydrated: !1,
                cache: c.cache,
                pendingSuspenseBoundaries: c.pendingSuspenseBoundaries,
                transitions: c.transitions,
              }),
              (t.updateQueue.baseState = i),
              (t.memoizedState = i),
              t.flags & 256)
            ) {
              ((l = Gn(Error(o(423)), t)), (t = Zc(e, t, r, n, l)));
              break e;
            } else if (r !== l) {
              ((l = Gn(Error(o(424)), t)), (t = Zc(e, t, r, n, l)));
              break e;
            } else
              for (
                st = Jt(t.stateNode.containerInfo.firstChild),
                  rt = t,
                  ye = !0,
                  wt = null,
                  n = dc(t, null, r, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
          else {
            if ((Wn(), r === l)) {
              t = Ht(e, t, n);
              break e;
            }
            Ue(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return (
          xc(t),
          e === null && va(t),
          (r = t.type),
          (l = t.pendingProps),
          (i = e !== null ? e.memoizedProps : null),
          (c = l.children),
          ca(r, l) ? (c = null) : i !== null && ca(r, i) && (t.flags |= 32),
          Gc(e, t),
          Ue(e, t, c, n),
          t.child
        );
      case 6:
        return (e === null && va(t), null);
      case 13:
        return eu(e, t, n);
      case 4:
        return (
          Ca(t, t.stateNode.containerInfo),
          (r = t.pendingProps),
          e === null ? (t.child = Qn(t, null, r, n)) : Ue(e, t, r, n),
          t.child
        );
      case 11:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : jt(r, l)),
          Qc(e, t, r, l, n)
        );
      case 7:
        return (Ue(e, t, t.pendingProps, n), t.child);
      case 8:
        return (Ue(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (Ue(e, t, t.pendingProps.children, n), t.child);
      case 10:
        e: {
          if (
            ((r = t.type._context),
            (l = t.pendingProps),
            (i = t.memoizedProps),
            (c = l.value),
            he(As, r._currentValue),
            (r._currentValue = c),
            i !== null)
          )
            if (yt(i.value, c)) {
              if (i.children === l.children && !Qe.current) {
                t = Ht(e, t, n);
                break e;
              }
            } else
              for (i = t.child, i !== null && (i.return = t); i !== null; ) {
                var d = i.dependencies;
                if (d !== null) {
                  c = i.child;
                  for (var p = d.firstContext; p !== null; ) {
                    if (p.context === r) {
                      if (i.tag === 1) {
                        ((p = Vt(-1, n & -n)), (p.tag = 2));
                        var k = i.updateQueue;
                        if (k !== null) {
                          k = k.shared;
                          var T = k.pending;
                          (T === null
                            ? (p.next = p)
                            : ((p.next = T.next), (T.next = p)),
                            (k.pending = p));
                        }
                      }
                      ((i.lanes |= n),
                        (p = i.alternate),
                        p !== null && (p.lanes |= n),
                        ba(i.return, n, t),
                        (d.lanes |= n));
                      break;
                    }
                    p = p.next;
                  }
                } else if (i.tag === 10) c = i.type === t.type ? null : i.child;
                else if (i.tag === 18) {
                  if (((c = i.return), c === null)) throw Error(o(341));
                  ((c.lanes |= n),
                    (d = c.alternate),
                    d !== null && (d.lanes |= n),
                    ba(c, n, t),
                    (c = i.sibling));
                } else c = i.child;
                if (c !== null) c.return = i;
                else
                  for (c = i; c !== null; ) {
                    if (c === t) {
                      c = null;
                      break;
                    }
                    if (((i = c.sibling), i !== null)) {
                      ((i.return = c.return), (c = i));
                      break;
                    }
                    c = c.return;
                  }
                i = c;
              }
          (Ue(e, t, l.children, n), (t = t.child));
        }
        return t;
      case 9:
        return (
          (l = t.type),
          (r = t.pendingProps.children),
          qn(t, n),
          (l = ct(l)),
          (r = r(l)),
          (t.flags |= 1),
          Ue(e, t, r, n),
          t.child
        );
      case 14:
        return (
          (r = t.type),
          (l = jt(r, t.pendingProps)),
          (l = jt(r.type, l)),
          Yc(e, t, r, l, n)
        );
      case 15:
        return qc(e, t, t.type, t.pendingProps, n);
      case 17:
        return (
          (r = t.type),
          (l = t.pendingProps),
          (l = t.elementType === r ? l : jt(r, l)),
          Qs(e, t),
          (t.tag = 1),
          Ye(r) ? ((e = !0), Es(t)) : (e = !1),
          qn(t, n),
          Fc(t, r, l),
          Fa(t, r, l, n),
          Va(null, t, r, !0, e, n)
        );
      case 19:
        return nu(e, t, n);
      case 22:
        return Kc(e, t, n);
    }
    throw Error(o(156, t.tag));
  };
  function Cu(e, t) {
    return so(e, t);
  }
  function jp(e, t, n, r) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = r),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ft(e, t, n, r) {
    return new jp(e, t, n, r);
  }
  function ci(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function Np(e) {
    if (typeof e == "function") return ci(e) ? 1 : 0;
    if (e != null) {
      if (((e = e.$$typeof), e === at)) return 11;
      if (e === Ct) return 14;
    }
    return 2;
  }
  function un(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = ft(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 14680064),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      n
    );
  }
  function rl(e, t, n, r, l, i) {
    var c = 2;
    if (((r = e), typeof e == "function")) ci(e) && (c = 1);
    else if (typeof e == "string") c = 5;
    else
      e: switch (e) {
        case G:
          return Sn(n.children, l, i, t);
        case de:
          ((c = 8), (l |= 8));
          break;
        case Te:
          return (
            (e = ft(12, n, t, l | 2)),
            (e.elementType = Te),
            (e.lanes = i),
            e
          );
        case et:
          return (
            (e = ft(13, n, t, l)),
            (e.elementType = et),
            (e.lanes = i),
            e
          );
        case gt:
          return (
            (e = ft(19, n, t, l)),
            (e.elementType = gt),
            (e.lanes = i),
            e
          );
        case ke:
          return sl(n, l, i, t);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case we:
                c = 10;
                break e;
              case $t:
                c = 9;
                break e;
              case at:
                c = 11;
                break e;
              case Ct:
                c = 14;
                break e;
              case We:
                ((c = 16), (r = null));
                break e;
            }
          throw Error(o(130, e == null ? e : typeof e, ""));
      }
    return (
      (t = ft(c, n, t, l)),
      (t.elementType = e),
      (t.type = r),
      (t.lanes = i),
      t
    );
  }
  function Sn(e, t, n, r) {
    return ((e = ft(7, e, r, t)), (e.lanes = n), e);
  }
  function sl(e, t, n, r) {
    return (
      (e = ft(22, e, r, t)),
      (e.elementType = ke),
      (e.lanes = n),
      (e.stateNode = { isHidden: !1 }),
      e
    );
  }
  function ui(e, t, n) {
    return ((e = ft(6, e, null, t)), (e.lanes = n), e);
  }
  function di(e, t, n) {
    return (
      (t = ft(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  function bp(e, t, n, r, l) {
    ((this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork =
        this.pingCache =
        this.current =
        this.pendingChildren =
          null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = Ol(0)),
      (this.expirationTimes = Ol(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Ol(0)),
      (this.identifierPrefix = r),
      (this.onRecoverableError = l),
      (this.mutableSourceEagerHydrationData = null));
  }
  function fi(e, t, n, r, l, i, c, d, p) {
    return (
      (e = new bp(e, t, n, d, p)),
      t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
      (i = ft(3, null, null, t)),
      (e.current = i),
      (i.stateNode = e),
      (i.memoizedState = {
        element: r,
        isDehydrated: n,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      Sa(i),
      e
    );
  }
  function kp(e, t, n) {
    var r =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: ee,
      key: r == null ? null : "" + r,
      children: e,
      containerInfo: t,
      implementation: n,
    };
  }
  function _u(e) {
    if (!e) return en;
    e = e._reactInternals;
    e: {
      if (mn(e) !== e || e.tag !== 1) throw Error(o(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ye(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(o(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ye(n)) return tc(e, n, t);
    }
    return t;
  }
  function Eu(e, t, n, r, l, i, c, d, p) {
    return (
      (e = fi(n, r, !0, e, l, i, c, d, p)),
      (e.context = _u(null)),
      (n = e.current),
      (r = Ve()),
      (l = on(n)),
      (i = Vt(r, l)),
      (i.callback = t ?? null),
      rn(n, i, l),
      (e.current.lanes = l),
      ur(e, l, r),
      Ge(e, r),
      e
    );
  }
  function ll(e, t, n, r) {
    var l = t.current,
      i = Ve(),
      c = on(l);
    return (
      (n = _u(n)),
      t.context === null ? (t.context = n) : (t.pendingContext = n),
      (t = Vt(i, c)),
      (t.payload = { element: e }),
      (r = r === void 0 ? null : r),
      r !== null && (t.callback = r),
      (e = rn(l, t, c)),
      e !== null && (kt(e, l, c, i), Ls(e, l, c)),
      c
    );
  }
  function al(e) {
    if (((e = e.current), !e.child)) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Mu(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function mi(e, t) {
    (Mu(e, t), (e = e.alternate) && Mu(e, t));
  }
  function Sp() {
    return null;
  }
  var zu =
    typeof reportError == "function"
      ? reportError
      : function (e) {
          console.error(e);
        };
  function pi(e) {
    this._internalRoot = e;
  }
  ((il.prototype.render = pi.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      ll(e, t, null, null);
    }),
    (il.prototype.unmount = pi.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (Nn(function () {
            ll(null, e, null, null);
          }),
            (t[Ot] = null));
        }
      }));
  function il(e) {
    this._internalRoot = e;
  }
  il.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = mo();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Kt.length && t !== 0 && t < Kt[n].priority; n++);
      (Kt.splice(n, 0, e), n === 0 && xo(e));
    }
  };
  function hi(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function ol(e) {
    return !(
      !e ||
      (e.nodeType !== 1 &&
        e.nodeType !== 9 &&
        e.nodeType !== 11 &&
        (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
    );
  }
  function Tu() {}
  function Cp(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function () {
          var k = al(c);
          i.call(k);
        };
      }
      var c = Eu(t, r, e, 0, null, !1, !1, "", Tu);
      return (
        (e._reactRootContainer = c),
        (e[Ot] = c.current),
        kr(e.nodeType === 8 ? e.parentNode : e),
        Nn(),
        c
      );
    }
    for (; (l = e.lastChild); ) e.removeChild(l);
    if (typeof r == "function") {
      var d = r;
      r = function () {
        var k = al(p);
        d.call(k);
      };
    }
    var p = fi(e, 0, !1, null, null, !1, !1, "", Tu);
    return (
      (e._reactRootContainer = p),
      (e[Ot] = p.current),
      kr(e.nodeType === 8 ? e.parentNode : e),
      Nn(function () {
        ll(t, p, n, r);
      }),
      p
    );
  }
  function cl(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var c = i;
      if (typeof l == "function") {
        var d = l;
        l = function () {
          var p = al(c);
          d.call(p);
        };
      }
      ll(t, c, e, l);
    } else c = Cp(n, t, e, l, r);
    return al(c);
  }
  ((uo = function (e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = cr(t.pendingLanes);
          n !== 0 &&
            (Fl(t, n | 1),
            Ge(t, Ce()),
            (ae & 6) === 0 && ((Zn = Ce() + 500), tn()));
        }
        break;
      case 13:
        (Nn(function () {
          var r = Ut(e, 1);
          if (r !== null) {
            var l = Ve();
            kt(r, e, 1, l);
          }
        }),
          mi(e, 1));
    }
  }),
    (Il = function (e) {
      if (e.tag === 13) {
        var t = Ut(e, 134217728);
        if (t !== null) {
          var n = Ve();
          kt(t, e, 134217728, n);
        }
        mi(e, 134217728);
      }
    }),
    (fo = function (e) {
      if (e.tag === 13) {
        var t = on(e),
          n = Ut(e, t);
        if (n !== null) {
          var r = Ve();
          kt(n, e, t, r);
        }
        mi(e, t);
      }
    }),
    (mo = function () {
      return me;
    }),
    (po = function (e, t) {
      var n = me;
      try {
        return ((me = e), t());
      } finally {
        me = n;
      }
    }),
    (Pl = function (e, t, n) {
      switch (t) {
        case "input":
          if ((kl(e, n), (t = n.name), n.type === "radio" && t != null)) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll(
                "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
              ),
                t = 0;
              t < n.length;
              t++
            ) {
              var r = n[t];
              if (r !== e && r.form === e.form) {
                var l = Cs(r);
                if (!l) throw Error(o(90));
                ($i(r), kl(r, l));
              }
            }
          }
          break;
        case "textarea":
          Ui(e, n);
          break;
        case "select":
          ((t = n.value), t != null && zn(e, !!n.multiple, t, !1));
      }
    }),
    (Xi = ai),
    (Ji = Nn));
  var _p = { usingClientEntryPoint: !1, Events: [_r, In, Cs, Ki, Gi, ai] },
    Br = {
      findFiberByHostInstance: pn,
      bundleType: 0,
      version: "18.3.1",
      rendererPackageName: "react-dom",
    },
    Ep = {
      bundleType: Br.bundleType,
      version: Br.version,
      rendererPackageName: Br.rendererPackageName,
      rendererConfig: Br.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: Z.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return ((e = no(e)), e === null ? null : e.stateNode);
      },
      findFiberByHostInstance: Br.findFiberByHostInstance || Sp,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ul = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ul.isDisabled && ul.supportsFiber)
      try {
        ((is = ul.inject(Ep)), (_t = ul));
      } catch {}
  }
  return (
    (Xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _p),
    (Xe.createPortal = function (e, t) {
      var n =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!hi(t)) throw Error(o(200));
      return kp(e, t, null, n);
    }),
    (Xe.createRoot = function (e, t) {
      if (!hi(e)) throw Error(o(299));
      var n = !1,
        r = "",
        l = zu;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
        (t = fi(e, 1, !1, null, null, n, !1, r, l)),
        (e[Ot] = t.current),
        kr(e.nodeType === 8 ? e.parentNode : e),
        new pi(t)
      );
    }),
    (Xe.findDOMNode = function (e) {
      if (e == null) return null;
      if (e.nodeType === 1) return e;
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == "function"
          ? Error(o(188))
          : ((e = Object.keys(e).join(",")), Error(o(268, e)));
      return ((e = no(t)), (e = e === null ? null : e.stateNode), e);
    }),
    (Xe.flushSync = function (e) {
      return Nn(e);
    }),
    (Xe.hydrate = function (e, t, n) {
      if (!ol(t)) throw Error(o(200));
      return cl(null, e, t, !0, n);
    }),
    (Xe.hydrateRoot = function (e, t, n) {
      if (!hi(e)) throw Error(o(405));
      var r = (n != null && n.hydratedSources) || null,
        l = !1,
        i = "",
        c = zu;
      if (
        (n != null &&
          (n.unstable_strictMode === !0 && (l = !0),
          n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
          n.onRecoverableError !== void 0 && (c = n.onRecoverableError)),
        (t = Eu(t, null, e, 1, n ?? null, l, !1, i, c)),
        (e[Ot] = t.current),
        kr(e),
        r)
      )
        for (e = 0; e < r.length; e++)
          ((n = r[e]),
            (l = n._getVersion),
            (l = l(n._source)),
            t.mutableSourceEagerHydrationData == null
              ? (t.mutableSourceEagerHydrationData = [n, l])
              : t.mutableSourceEagerHydrationData.push(n, l));
      return new il(t);
    }),
    (Xe.render = function (e, t, n) {
      if (!ol(t)) throw Error(o(200));
      return cl(null, e, t, !1, n);
    }),
    (Xe.unmountComponentAtNode = function (e) {
      if (!ol(e)) throw Error(o(40));
      return e._reactRootContainer
        ? (Nn(function () {
            cl(null, null, e, !1, function () {
              ((e._reactRootContainer = null), (e[Ot] = null));
            });
          }),
          !0)
        : !1;
    }),
    (Xe.unstable_batchedUpdates = ai),
    (Xe.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
      if (!ol(n)) throw Error(o(200));
      if (e == null || e._reactInternals === void 0) throw Error(o(38));
      return cl(e, t, n, !1, r);
    }),
    (Xe.version = "18.3.1-next-f1338f8080-20240426"),
    Xe
  );
}
var Fu;
function $p() {
  if (Fu) return vi.exports;
  Fu = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (u) {
        console.error(u);
      }
  }
  return (a(), (vi.exports = Lp()), vi.exports);
}
var Iu;
function Op() {
  if (Iu) return dl;
  Iu = 1;
  var a = $p();
  return ((dl.createRoot = a.createRoot), (dl.hydrateRoot = a.hydrateRoot), dl);
}
var Fp = Op();
const Ip = Ju(Fp);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bp = (a) =>
  a == null ? void 0 : a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ function Up(a, u, o = []) {
  if (u == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: Bp(a),
    size: 24,
    node: u,
    ...(o.length > 0 ? { aliases: o } : {}),
  };
}
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vp = (a) => {
  let u = "",
    o = !1;
  for (const m of a) {
    if (m === "-" || m === "_" || m <= " ") {
      o = u.length > 0;
      continue;
    }
    (u.length === 0 ? (u += m.toLowerCase()) : (u += o ? m.toUpperCase() : m),
      (o = !1));
  }
  return u;
};
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hp = (a) => {
  const u = Vp(a);
  return u.charAt(0).toUpperCase() + u.slice(1);
};
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ki = (...a) =>
  a
    .filter((u, o, m) => !!u && u.trim() !== "" && m.indexOf(u) === o)
    .join(" ")
    .trim();
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cn = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ function ji(a) {
  return a != null;
}
function Wp(a, u = {}) {
  var _, R;
  const o = u.attributeNames ?? {},
    m = ($) => o[$] ?? $,
    f = a.size ?? a.width ?? Cn.width,
    h = a.size ?? a.height ?? Cn.height,
    j =
      ((_ = a.aliases) == null
        ? void 0
        : _.filter(($) => typeof $ == "string" && $.trim() !== "").map(
            ($) => `lucide-${$}`,
          )) ?? [],
    y = [...(a.name ? [`lucide-${a.name}`] : []), ...j],
    g =
      ((R = u.className) == null ? void 0 : R.split(" ").filter(Boolean)) ?? [],
    E = u.includeDefaultClasses === !1 ? ki(...g) : ki("lucide", ...y, ...g),
    N = u.absoluteStrokeWidth
      ? (Number(u.strokeWidth ?? Cn["stroke-width"]) *
          Number(a.size ?? a.width ?? Cn.width)) /
        Number(u.size ?? u.width ?? Cn.width)
      : (u.strokeWidth ?? Cn["stroke-width"]);
  return [
    "svg",
    {
      ...Object.entries(Cn).reduce(($, [C, D]) => (($[m(C)] = D), $), {}),
      ...("color" in u && u.color && { [m("stroke")]: u.color }),
      ...("size" in u &&
        ji(u.size) && { [m("width")]: u.size, [m("height")]: u.size }),
      ...("width" in u && ji(u.width) && { [m("width")]: u.width }),
      ...("height" in u && ji(u.height) && { [m("height")]: u.height }),
      [m("stroke-width")]: N,
      ...(E && { [m("class")]: E }),
      [m("viewBox")]: `0 0 ${f} ${h}`,
      ...(u.hasA11yProp === !1 ? { [m("aria-hidden")]: "true" } : {}),
      ...("attributes" in u && u.attributes),
    },
    a.node.map(($) => {
      const [C, D, Q] = $,
        te = u.nonScalingStroke
          ? { [m("vector-effect")]: "non-scaling-stroke", ...D }
          : D;
      return Q ? [C, te, Q] : [C, te];
    }),
  ];
}
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ function Qp(a, u = {}) {
  return Wp(a, {
    ...u,
    attributeNames: {
      ...u.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect",
    },
  });
}
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Yp = (a) => {
    for (const u in a)
      if (u.startsWith("aria-") || u === "role" || u === "title") return !0;
    return !1;
  },
  qp = P.createContext({}),
  Kp = () => P.useContext(qp),
  Gp = P.forwardRef(
    (
      {
        color: a,
        size: u,
        width: o,
        height: m,
        strokeWidth: f,
        absoluteStrokeWidth: h,
        nonScalingStroke: j,
        className: y = "",
        children: g,
        iconNode: E = [],
        icon: N = { node: E, aliases: [], size: 24 },
        ...S
      },
      _,
    ) => {
      const {
          size: R = 24,
          strokeWidth: $ = 2,
          absoluteStrokeWidth: C = !1,
          nonScalingStroke: D = !1,
          color: Q = "currentColor",
          className: te = "",
        } = Kp() ?? {},
        le = !!g || Yp(S),
        [Z, be, ee = []] = Qp(N, {
          color: a ?? Q,
          width: o ?? u ?? R,
          height: m ?? u ?? R,
          strokeWidth: f ?? $,
          absoluteStrokeWidth: h ?? C,
          nonScalingStroke: j ?? D,
          className: ki(te, y),
          hasA11yProp: le,
          attributes: S,
        });
      return P.createElement(Z, { ref: _, ...be }, [
        ...ee.map(([G, de]) => P.createElement(G, de)),
        ...(Array.isArray(g) ? g : [g]),
      ]);
    },
  );
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ function B(a, u = [], o = []) {
  const m = typeof a == "string" ? Up(a, u, o) : a,
    f = P.forwardRef(({ className: h, ...j }, y) =>
      P.createElement(Gp, { ref: y, icon: m, className: h, ...j }),
    );
  return (m.name && (f.displayName = Hp(m.name)), f);
}
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zu = {
  name: "activity",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        key: "169zse",
      },
    ],
  ],
};
Zu.node;
const ed = B(Zu);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const td = {
  name: "arrow-right",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
  ],
};
td.node;
const Xp = B(td);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const nd = {
  name: "arrow-up-right",
  size: 24,
  node: [
    ["path", { d: "M7 7h10v10", key: "1tivn9" }],
    ["path", { d: "M7 17 17 7", key: "1vkiza" }],
  ],
};
nd.node;
const Jp = B(nd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const rd = {
  name: "award",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
        key: "1yiouv",
      },
    ],
    ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }],
  ],
};
rd.node;
const Zp = B(rd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sd = {
  name: "badge-check",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        key: "3c2336",
      },
    ],
    ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }],
  ],
  aliases: ["verified"],
};
sd.node;
const e0 = B(sd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ld = {
  name: "ban",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M4.929 4.929 19.07 19.071", key: "196cmz" }],
  ],
};
ld.node;
const t0 = B(ld);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ad = {
  name: "bell",
  size: 24,
  node: [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        key: "11g9vi",
      },
    ],
  ],
};
ad.node;
const n0 = B(ad);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const id = {
  name: "calendar-check",
  size: 24,
  node: [
    ["path", { d: "M8 2v3", key: "1ioesn" }],
    ["path", { d: "M16 2v3", key: "otl347" }],
    [
      "rect",
      { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "m9 15 2 2 4-4", key: "1grp1n" }],
  ],
};
id.node;
const r0 = B(id);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const od = {
  name: "calendar-clock",
  size: 24,
  node: [
    ["path", { d: "M16 14v2.2l1.6 1", key: "fo4ql5" }],
    ["path", { d: "M16 2v3", key: "otl347" }],
    [
      "path",
      {
        d: "M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338",
        key: "7hb8p4",
      },
    ],
    ["path", { d: "M3 9h5.859", key: "numkqi" }],
    ["path", { d: "M8 2v3", key: "1ioesn" }],
    ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }],
  ],
};
od.node;
const s0 = B(od);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const cd = {
  name: "calendar-days",
  size: 24,
  node: [
    ["path", { d: "M8 2v3", key: "1ioesn" }],
    ["path", { d: "M16 2v3", key: "otl347" }],
    [
      "rect",
      { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "M8 13h.01", key: "1sbv64" }],
    ["path", { d: "M12 13h.01", key: "y0uutt" }],
    ["path", { d: "M16 13h.01", key: "wip0gl" }],
    ["path", { d: "M8 17h.01", key: "p3bg7i" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
    ["path", { d: "M16 17h.01", key: "ql8jdd" }],
  ],
};
cd.node;
const tr = B(cd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ud = {
  name: "calendar",
  size: 24,
  node: [
    ["path", { d: "M8 2v3", key: "1ioesn" }],
    ["path", { d: "M16 2v3", key: "otl347" }],
    [
      "rect",
      { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
  ],
};
ud.node;
const wl = B(ud);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dd = {
  name: "check-check",
  size: 24,
  node: [
    ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
    ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }],
  ],
};
dd.node;
const l0 = B(dd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fd = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
};
fd.node;
const Mn = B(fd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const md = {
  name: "chevron-down",
  size: 24,
  node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
};
md.node;
const pd = B(md);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hd = {
  name: "chevron-right",
  size: 24,
  node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]],
};
hd.node;
const a0 = B(hd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const xd = {
  name: "circle-check",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }],
  ],
  aliases: ["check-circle-2"],
};
xd.node;
const jl = B(xd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const gd = {
  name: "circle-question-mark",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  aliases: ["help-circle", "circle-help"],
};
gd.node;
const i0 = B(gd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const vd = {
  name: "circle-x",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }],
  ],
  aliases: ["x-circle"],
};
vd.node;
const yd = B(vd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const wd = {
  name: "clipboard-check",
  size: 24,
  node: [
    [
      "rect",
      {
        width: "8",
        height: "4",
        x: "8",
        y: "2",
        rx: "1",
        ry: "1",
        key: "tgr4d6",
      },
    ],
    [
      "path",
      {
        d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        key: "116196",
      },
    ],
    ["path", { d: "m9 14 2 2 4-4", key: "df797q" }],
  ],
};
wd.node;
const jd = B(wd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Nd = {
  name: "clipboard-list",
  size: 24,
  node: [
    [
      "rect",
      {
        width: "8",
        height: "4",
        x: "8",
        y: "2",
        rx: "1",
        ry: "1",
        key: "tgr4d6",
      },
    ],
    [
      "path",
      {
        d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        key: "116196",
      },
    ],
    ["path", { d: "M12 11h4", key: "1jrz19" }],
    ["path", { d: "M12 16h4", key: "n85exb" }],
    ["path", { d: "M8 11h.01", key: "1dfujw" }],
    ["path", { d: "M8 16h.01", key: "18s6g9" }],
  ],
};
Nd.node;
const Si = B(Nd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const bd = {
  name: "clock",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ],
};
bd.node;
const qr = B(bd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const kd = {
  name: "cloud-upload",
  size: 24,
  node: [
    ["path", { d: "M12 13v8", key: "1l5pq0" }],
    [
      "path",
      {
        d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
        key: "1pljnt",
      },
    ],
    ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }],
  ],
  aliases: ["upload-cloud"],
};
kd.node;
const o0 = B(kd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Sd = {
  name: "download",
  size: 24,
  node: [
    ["path", { d: "M12 15V3", key: "m9g1x1" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }],
  ],
};
Sd.node;
const c0 = B(Sd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cd = {
  name: "droplet",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
        key: "c7niix",
      },
    ],
  ],
};
Cd.node;
const u0 = B(Cd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _d = {
  name: "eye",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
};
_d.node;
const d0 = B(_d);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ed = {
  name: "file-search",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6",
      },
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["circle", { cx: "11.5", cy: "14.5", r: "2.5", key: "1bq0ko" }],
    ["path", { d: "M13.3 16.3 15 18", key: "2quom7" }],
  ],
};
Ed.node;
const f0 = B(Ed);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Md = {
  name: "file-text",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6",
      },
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }],
  ],
};
Md.node;
const zd = B(Md);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Td = {
  name: "funnel",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
        key: "sc7q7i",
      },
    ],
  ],
  aliases: ["filter"],
};
Td.node;
const m0 = B(Td);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Pd = {
  name: "hard-drive",
  size: 24,
  node: [
    ["path", { d: "M10 16h.01", key: "1bzywj" }],
    [
      "path",
      {
        d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        key: "18tbho",
      },
    ],
    ["path", { d: "M21.946 12.013H2.054", key: "zqlbp7" }],
    ["path", { d: "M6 16h.01", key: "1pmjb7" }],
  ],
};
Pd.node;
const p0 = B(Pd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Rd = {
  name: "heart-pulse",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        key: "mvr1a0",
      },
    ],
    ["path", { d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "auskq0" }],
  ],
};
Rd.node;
const Ad = B(Rd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Dd = {
  name: "heart",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        key: "mvr1a0",
      },
    ],
  ],
};
Dd.node;
const h0 = B(Dd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ld = {
  name: "house",
  size: 24,
  node: [
    [
      "path",
      { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" },
    ],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1",
      },
    ],
  ],
  aliases: ["home"],
};
Ld.node;
const x0 = B(Ld);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $d = {
  name: "inbox",
  size: 24,
  node: [
    [
      "polyline",
      { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" },
    ],
    [
      "path",
      {
        d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        key: "oot6mr",
      },
    ],
  ],
};
$d.node;
const g0 = B($d);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Od = {
  name: "layout-dashboard",
  size: 24,
  node: [
    [
      "rect",
      { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" },
    ],
    [
      "rect",
      { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" },
    ],
    [
      "rect",
      { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" },
    ],
    [
      "rect",
      { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" },
    ],
  ],
};
Od.node;
const Fd = B(Od);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Id = {
  name: "loader-circle",
  size: 24,
  node: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  aliases: ["loader-2"],
};
Id.node;
const ht = B(Id);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bd = {
  name: "lock",
  size: 24,
  node: [
    [
      "rect",
      {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2",
        key: "1w4ew1",
      },
    ],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
  ],
};
Bd.node;
const v0 = B(Bd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ud = {
  name: "log-out",
  size: 24,
  node: [
    ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
    ["path", { d: "M21 12H9", key: "dn1m92" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ],
};
Ud.node;
const Nl = B(Ud);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vd = {
  name: "log-in",
  size: 24,
  node: [
    ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
    ["path", { d: "M15 12H3", key: "6jk70r" }],
    ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }],
  ],
};
Vd.node;
const y0 = B(Vd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hd = {
  name: "mail",
  size: 24,
  node: [
    ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
    [
      "rect",
      { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" },
    ],
  ],
};
Hd.node;
const w0 = B(Hd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wd = {
  name: "map-pin",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        key: "1r0f0z",
      },
    ],
    ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ],
};
Wd.node;
const Kr = B(Wd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Qd = {
  name: "phone-call",
  size: 24,
  node: [
    ["path", { d: "M13 2a9 9 0 0 1 9 9", key: "1itnx2" }],
    ["path", { d: "M13 6a5 5 0 0 1 5 5", key: "11nki7" }],
    [
      "path",
      {
        d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        key: "9njp5v",
      },
    ],
  ],
};
Qd.node;
const Yd = B(Qd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qd = {
  name: "phone",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        key: "9njp5v",
      },
    ],
  ],
};
qd.node;
const zi = B(qd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Kd = {
  name: "pill",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",
        key: "wa1lgi",
      },
    ],
    ["path", { d: "m8.5 8.5 7 7", key: "rvfmvr" }],
  ],
};
Kd.node;
const j0 = B(Kd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gd = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
};
Gd.node;
const N0 = B(Gd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xd = {
  name: "qr-code",
  size: 24,
  node: [
    [
      "rect",
      { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" },
    ],
    [
      "rect",
      { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" },
    ],
    [
      "rect",
      { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" },
    ],
    ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
    ["path", { d: "M21 21v.01", key: "ents32" }],
    ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
    ["path", { d: "M3 12h.01", key: "nlz23k" }],
    ["path", { d: "M12 3h.01", key: "n36tog" }],
    ["path", { d: "M12 16v.01", key: "133mhm" }],
    ["path", { d: "M16 12h1", key: "1slzba" }],
    ["path", { d: "M21 12v.01", key: "1lwtk9" }],
    ["path", { d: "M12 21v-1", key: "1880an" }],
  ],
};
Xd.node;
const Jd = B(Xd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zd = {
  name: "refresh-cw",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
        key: "v9h5vc",
      },
    ],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    [
      "path",
      {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
        key: "3uifl3",
      },
    ],
    ["path", { d: "M8 16H3v5", key: "1cv678" }],
  ],
};
Zd.node;
const b0 = B(Zd);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ef = {
  name: "rotate-ccw-clock",
  size: 24,
  node: [
    [
      "path",
      { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" },
    ],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
    ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }],
  ],
  aliases: ["history"],
};
ef.node;
const k0 = B(ef);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const tf = {
  name: "rotate-ccw",
  size: 24,
  node: [
    [
      "path",
      { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" },
    ],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ],
};
tf.node;
const S0 = B(tf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const nf = {
  name: "scroll-text",
  size: 24,
  node: [
    ["path", { d: "M15 12h-5", key: "r7krc0" }],
    ["path", { d: "M15 8h-5", key: "1khuty" }],
    ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
    [
      "path",
      {
        d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
        key: "1ph1d7",
      },
    ],
  ],
};
nf.node;
const rf = B(nf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sf = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ],
};
sf.node;
const Ti = B(sf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const lf = {
  name: "settings",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
};
lf.node;
const C0 = B(lf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const af = {
  name: "shield-alert",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
    ["path", { d: "M12 8v4", key: "1got3b" }],
    ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ],
};
af.node;
const of = B(af);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const cf = {
  name: "shield-check",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
};
cf.node;
const Gr = B(cf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const uf = {
  name: "siren",
  size: 24,
  node: [
    ["path", { d: "M7 18v-6a5 5 0 1 1 10 0v6", key: "pcx96s" }],
    [
      "path",
      {
        d: "M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z",
        key: "1b4s83",
      },
    ],
    ["path", { d: "M21 12h1", key: "jtio3y" }],
    ["path", { d: "M18.5 4.5 18 5", key: "g5sp9y" }],
    ["path", { d: "M2 12h1", key: "1uaihz" }],
    ["path", { d: "M12 2v1", key: "11qlp1" }],
    ["path", { d: "m4.929 4.929.707.707", key: "1i51kw" }],
    ["path", { d: "M12 12v6", key: "3ahymv" }],
  ],
};
uf.node;
const df = B(uf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ff = {
  name: "sliders-horizontal",
  size: 24,
  node: [
    ["path", { d: "M10 5H3", key: "1qgfaw" }],
    ["path", { d: "M12 19H3", key: "yhmn1j" }],
    ["path", { d: "M14 3v4", key: "1sua03" }],
    ["path", { d: "M16 17v4", key: "1q0r14" }],
    ["path", { d: "M21 12h-9", key: "1o4lsq" }],
    ["path", { d: "M21 19h-5", key: "1rlt1p" }],
    ["path", { d: "M21 5h-7", key: "1oszz2" }],
    ["path", { d: "M8 10v4", key: "tgpxqk" }],
    ["path", { d: "M8 12H3", key: "a7s4jb" }],
  ],
};
ff.node;
const _0 = B(ff);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mf = {
  name: "sparkles",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        key: "1s2grr",
      },
    ],
    ["path", { d: "M20 2v4", key: "1rf3ol" }],
    ["path", { d: "M22 4h-4", key: "gwowj6" }],
    ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }],
  ],
  aliases: ["stars"],
};
mf.node;
const E0 = B(mf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const pf = {
  name: "star",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
        key: "r04s7s",
      },
    ],
  ],
};
pf.node;
const hf = B(pf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const xf = {
  name: "stethoscope",
  size: 24,
  node: [
    ["path", { d: "M11 2v2", key: "1539x4" }],
    ["path", { d: "M5 2v2", key: "1yf1q8" }],
    [
      "path",
      {
        d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",
        key: "rb5t3r",
      },
    ],
    ["path", { d: "M8 15a6 6 0 0 0 12 0v-3", key: "x18d4x" }],
    ["circle", { cx: "20", cy: "10", r: "2", key: "ts1r5v" }],
  ],
};
xf.node;
const Xr = B(xf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const gf = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
  ],
  aliases: ["trash-2"],
};
gf.node;
const vf = B(gf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yf = {
  name: "triangle-alert",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        key: "wmoenq",
      },
    ],
    ["path", { d: "M12 9v4", key: "juzpu7" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  aliases: ["alert-triangle"],
};
yf.node;
const wf = B(yf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const jf = {
  name: "user-plus",
  size: 24,
  node: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
    ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }],
  ],
};
jf.node;
const M0 = B(jf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Nf = {
  name: "user-x",
  size: 24,
  node: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
    ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }],
  ],
};
Nf.node;
const z0 = B(Nf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const bf = {
  name: "user",
  size: 24,
  node: [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
  ],
};
bf.node;
const T0 = B(bf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const kf = {
  name: "users",
  size: 24,
  node: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ],
};
kf.node;
const Ci = B(kf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Sf = {
  name: "video",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
        key: "ftymec",
      },
    ],
    [
      "rect",
      { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" },
    ],
  ],
};
Sf.node;
const Pi = B(Sf);
/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cf = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
};
Cf.node;
const Jr = B(Cf);
function $e(a, u = [], { immediate: o = !0 } = {}) {
  const [m, f] = P.useState({ data: null, error: null, loading: o }),
    h = P.useRef(!0),
    j = P.useRef(a);
  ((j.current = a),
    P.useEffect(
      () => (
        (h.current = !0),
        () => {
          h.current = !1;
        }
      ),
      [],
    ));
  const y = P.useCallback(async () => {
    f((g) => ({ ...g, loading: !0, error: null }));
    try {
      const g = await j.current();
      return (h.current && f({ data: g, error: null, loading: !1 }), g);
    } catch (g) {
      return (h.current && f({ data: null, error: g, loading: !1 }), null);
    }
  }, []);
  return (
    P.useEffect(() => {
      o && y();
    }, u),
    { ...m, reload: y, setData: (g) => f((E) => ({ ...E, data: g })) }
  );
}
const P0 = "https://medlink-8vbl.onrender.com/api".replace(/\/$/, ""),
  _n = {
    access: "ss.accessToken",
    refresh: "ss.refreshToken",
    user: "ss.user",
  };
class _f extends Error {
  constructor(u, o, m, f) {
    (super(m),
      (this.name = "ApiError"),
      (this.status = u),
      (this.code = o),
      (this.details = f));
  }
  get fieldMessages() {
    return Array.isArray(this.details)
      ? this.details.map((u) => {
          const o = Array.isArray(u.path) ? u.path.join(".") : u.path;
          return o ? `${o}: ${u.message}` : u.message;
        })
      : [];
  }
}
const Je = {
    get access() {
      return localStorage.getItem(_n.access);
    },
    get refresh() {
      return localStorage.getItem(_n.refresh);
    },
    get user() {
      try {
        return JSON.parse(localStorage.getItem(_n.user) || "null");
      } catch {
        return null;
      }
    },
    save({ tokens: a, user: u }) {
      (a != null &&
        a.accessToken &&
        localStorage.setItem(_n.access, a.accessToken),
        a != null &&
          a.refreshToken &&
          localStorage.setItem(_n.refresh, a.refreshToken),
        u && localStorage.setItem(_n.user, JSON.stringify(u)));
    },
    clear() {
      Object.values(_n).forEach((a) => localStorage.removeItem(a));
    },
  },
  _i = new Set(),
  R0 = (a) => (_i.add(a), () => _i.delete(a)),
  A0 = () => {
    (Je.clear(), _i.forEach((a) => a()));
  },
  Ef = (a, u) => {
    const o = new URL(`${P0}${a.startsWith("/") ? a : `/${a}`}`);
    return (
      Object.entries(u || {}).forEach(([m, f]) => {
        f == null || f === "" || o.searchParams.set(m, String(f));
      }),
      o.toString()
    );
  },
  D0 = async (a) => {
    let u = null;
    try {
      u = await a.json();
    } catch {}
    const o = u == null ? void 0 : u.error;
    return new _f(
      a.status,
      (o == null ? void 0 : o.code) || "HTTP_ERROR",
      (o == null ? void 0 : o.message) ||
        `Request failed with status ${a.status}`,
      o == null ? void 0 : o.details,
    );
  };
let fl = null;
const L0 = async () => {
    const a = Je.refresh;
    return a
      ? (fl ||
          (fl = fetch(Ef("/auth/refresh"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: a }),
          })
            .then(async (u) => {
              var f;
              if (!u.ok) return null;
              const o = await u.json(),
                m =
                  (f = o == null ? void 0 : o.data) == null ? void 0 : f.tokens;
              return m != null && m.accessToken
                ? (Je.save({ tokens: m }), m.accessToken)
                : null;
            })
            .catch(() => null)
            .finally(() => {
              fl = null;
            })),
        fl)
      : null;
  },
  fn = async (a, u = {}) => {
    const {
        method: o = "GET",
        body: m,
        query: f,
        form: h,
        raw: j = !1,
        auth: y = !0,
        _retried: g = !1,
      } = u,
      E = {};
    (y && Je.access && (E.Authorization = `Bearer ${Je.access}`),
      m !== void 0 && !h && (E["Content-Type"] = "application/json"));
    let N;
    try {
      N = await fetch(Ef(a, f), {
        method: o,
        headers: E,
        body: h || (m !== void 0 ? JSON.stringify(m) : void 0),
      });
    } catch {
      throw new _f(
        0,
        "NETWORK_ERROR",
        "Cannot reach the server. It may be waking up - try again in a moment.",
      );
    }
    if (N.status === 401 && y && !g) {
      if (await L0()) return fn(a, { ...u, _retried: !0 });
      A0();
    }
    if (!N.ok) throw await D0(N);
    if (N.status === 204) return null;
    if (j) return N.blob();
    const S = await N.json();
    if (S != null && S.meta && Array.isArray(S.data)) {
      const _ = S.data;
      return ((_.meta = S.meta), _);
    }
    return (S == null ? void 0 : S.data) ?? S;
  },
  K = {
    get: (a, u, o) => fn(a, { ...o, method: "GET", query: u }),
    post: (a, u, o) => fn(a, { ...o, method: "POST", body: u }),
    put: (a, u, o) => fn(a, { ...o, method: "PUT", body: u }),
    patch: (a, u, o) => fn(a, { ...o, method: "PATCH", body: u }),
    delete: (a, u) => fn(a, { ...u, method: "DELETE" }),
  },
  vl = {
    register: (a) => K.post("/auth/register", a, { auth: !1 }),
    login: (a) => K.post("/auth/login", a, { auth: !1 }),
    refresh: (a) => K.post("/auth/refresh", { refreshToken: a }, { auth: !1 }),
    logout: (a) => K.post("/auth/logout", { refreshToken: a }),
    changePassword: (a) => K.post("/auth/change-password", a),
  },
  yl = { me: () => K.get("/users/me"), updateMe: (a) => K.put("/users/me", a) },
  Yr = {
    me: () => K.get("/patients/me"),
    updateMe: (a) => K.put("/patients/me", a),
    dashboard: () => K.get("/patients/dashboard"),
    medicalHistory: () => K.get("/patients/medical-history"),
    medicines: () => K.get("/patients/medicines"),
    confirmMedicine: (a) => K.patch(`/patients/medicines/${a}/confirm`),
    stopMedicine: (a) => K.patch(`/patients/medicines/${a}/stop`),
  },
  Mf = {
    search: (a) => K.get("/doctors", a),
    get: (a) => K.get(`/doctors/${a}`),
    slots: (a, u, o) => K.get(`/doctors/${a}/slots`, { date: u, mode: o }),
  },
  En = {
    profile: () => K.get("/doctors/me"),
    updateProfile: (a) => K.put("/doctors/me", a),
    dashboard: () => K.get("/doctors/dashboard"),
    appointments: (a) => K.get("/doctors/appointments", a),
    setAppointmentStatus: (a, u, o) =>
      K.patch(`/doctors/appointments/${a}/status`, { status: u, reason: o }),
    availability: () => K.get("/doctors/availability"),
    setAvailability: (a, u) =>
      K.post("/doctors/availability", {
        availability: a,
        ...(u ? { exceptions: u } : {}),
      }),
    patientView: (a) => K.get(`/doctors/patients/${a}`),
  },
  Qr = {
    mine: (a) => K.get("/appointments/my", a),
    get: (a) => K.get(`/appointments/${a}`),
    book: (a) => K.post("/appointments", a),
    cancel: (a, u) => K.patch(`/appointments/${a}/cancel`, { reason: u }),
    reschedule: (a, u) => K.patch(`/appointments/${a}/reschedule`, u),
  },
  Vr = {
    mine: (a) => K.get("/documents/my", a),
    upload: ({
      file: a,
      title: u,
      category: o = "other",
      description: m,
      documentDate: f,
    }) => {
      const h = new FormData();
      return (
        h.append("file", a),
        h.append("title", u),
        h.append("category", o),
        m && h.append("description", m),
        f && h.append("documentDate", f),
        fn("/documents/upload", { method: "POST", form: h })
      );
    },
    meta: (a) => K.get(`/documents/${a}/meta`),
    download: (a) => fn(`/documents/${a}`, { raw: !0 }),
    archive: (a) => K.delete(`/documents/${a}`),
  },
  $0 = {
    list: (a) => K.get("/reminders", a),
    get: (a) => K.get(`/reminders/${a}`),
    recordAdherence: (a, u) =>
      K.patch(`/reminders/${a}/adherence`, { outcome: u }),
  },
  Bu = {
    list: (a) => K.get("/notifications", a),
    markRead: (a) => K.patch(`/notifications/${a}/read`),
    markAllRead: () => K.patch("/notifications/read-all"),
  },
  O0 = { list: (a) => K.get("/audit-logs", a) },
  nr = {
    dashboard: () => K.get("/admin/dashboard"),
    verifications: (a) => K.get("/admin/verifications", a),
    verify: (a, u, o, m) =>
      K.patch(`/admin/verifications/${a}`, { role: u, status: o, reason: m }),
    users: (a) => K.get("/admin/users", a),
    setUserStatus: (a, u, o) =>
      K.patch(`/admin/users/${a}/status`, { status: u, reason: o }),
    auditLogs: (a) => K.get("/admin/audit-logs", a),
    accessReport: () => K.get("/admin/access-report"),
  },
  Ei = {
    sos: (a) => K.post("/emergency/sos", a),
    myRequests: () => K.get("/emergency/my-requests"),
    contacts: () => K.get("/emergency-contacts"),
    addContact: (a) => K.post("/emergency-contacts", a),
    nearbyHospitals: (a) => K.get("/emergency/hospitals/nearby", a),
  };
function F0() {
  const [a, u] = P.useState(!1),
    o = async () => {
      if (
        confirm(`Raise an emergency SOS?

This alerts nearby responders and hospitals with your location. Only continue if this is a real emergency.`)
      ) {
        u(!0);
        try {
          const m = await new Promise((h, j) => {
              if (!navigator.geolocation) {
                j(
                  new Error(
                    "This browser cannot share your location, which the dispatcher needs.",
                  ),
                );
                return;
              }
              navigator.geolocation.getCurrentPosition(
                h,
                () =>
                  j(
                    new Error(
                      "Location permission denied. Responders cannot be dispatched without it.",
                    ),
                  ),
                { timeout: 1e4 },
              );
            }),
            f = await Ei.sos({
              emergencyType: "medical",
              severity: "high",
              location: [m.coords.longitude, m.coords.latitude],
              description: "SOS raised from the Swasthya Setu web app",
            });
          alert(`SOS raised.

Reference: ${f._id}
Status: ${f.status}

Keep this screen open - responders are being notified.`);
        } catch (m) {
          alert(m.message);
        } finally {
          u(!1);
        }
      }
    };
  return s.jsxs("button", {
    onClick: o,
    disabled: a,
    className:
      "w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors",
    children: [
      a
        ? s.jsx(ht, { className: "w-3.5 h-3.5 animate-spin" })
        : s.jsx(Yd, { className: "w-3.5 h-3.5" }),
      s.jsx("span", { children: a ? "Raising SOS..." : "Raise Emergency SOS" }),
    ],
  });
}
const I0 = [
  { id: "home", label: "Home", icon: x0 },
  { id: "appointments", label: "Appointments", icon: wl },
  { id: "doctors", label: "Find Doctors", icon: Xr },
  { id: "records", label: "Medical Records", icon: zd },
  { id: "profile", label: "Profile & Settings", icon: C0 },
];
function B0({ activeTab: a, onSelectTab: u }) {
  const { data: o } = $e(() => Qr.mine({ upcoming: !0, limit: 100 }), []),
    m = (o || []).filter((f) =>
      ["requested", "confirmed", "rescheduled"].includes(f.status),
    ).length;
  return s.jsxs("aside", {
    className:
      "w-64 bg-[#0D2040] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none",
    children: [
      s.jsxs("div", {
        className: "p-5 flex items-center gap-3 border-b border-slate-800/80",
        children: [
          s.jsx("div", {
            className:
              "w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30",
            children: s.jsx(Ad, {
              className: "w-6 h-6 text-white animate-pulse",
            }),
          }),
          s.jsxs("div", {
            children: [
              s.jsxs("h1", {
                className:
                  "font-bold text-base tracking-tight text-white flex items-center gap-1.5",
                children: [
                  "Swasthya ",
                  s.jsx("span", {
                    className: "text-blue-400",
                    children: "Setu",
                  }),
                ],
              }),
              s.jsx("span", {
                className:
                  "text-[10px] font-medium text-emerald-400 tracking-wide uppercase",
                children: "A BRIDGE TOWARDS HEALTH",
              }),
            ],
          }),
        ],
      }),
      s.jsxs("nav", {
        className: "p-3 space-y-1.5 flex-1",
        children: [
          s.jsx("p", {
            className:
              "px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase",
            children: "Menu",
          }),
          I0.map(({ id: f, label: h, icon: j }) => {
            const y = a === f;
            return s.jsxs(
              "button",
              {
                onClick: () => u(f),
                className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${y ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold" : "text-slate-300 hover:bg-white/5 hover:text-white"}`,
                children: [
                  s.jsx(j, {
                    className: `w-4 h-4 ${y ? "text-white" : "text-slate-400"}`,
                  }),
                  s.jsx("span", { children: h }),
                  f === "appointments" &&
                    m > 0 &&
                    s.jsx("span", {
                      className:
                        "ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300",
                      children: m,
                    }),
                ],
              },
              f,
            );
          }),
        ],
      }),
      s.jsxs("div", {
        className:
          "p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-[#142A4D] border border-slate-700/60",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-2 mb-2",
            children: [
              s.jsxs("span", {
                className: "relative flex h-2.5 w-2.5",
                children: [
                  s.jsx("span", {
                    className:
                      "animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75",
                  }),
                  s.jsx("span", {
                    className:
                      "relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500",
                  }),
                ],
              }),
              s.jsx("span", {
                className: "text-xs font-semibold text-rose-300",
                children: "Emergency 24x7",
              }),
            ],
          }),
          s.jsx("p", {
            className: "text-xs text-slate-300 mb-3",
            children: "Direct line to ambulance & emergency doctor triage.",
          }),
          s.jsx(F0, {}),
        ],
      }),
    ],
  });
}
function U0({
  value: a,
  onChange: u,
  placeholder: o = "Search...",
  className: m = "",
  onClear: f,
}) {
  return s.jsxs("div", {
    className: `relative flex items-center ${m}`,
    children: [
      s.jsx(Ti, {
        className:
          "w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none",
      }),
      s.jsx("input", {
        type: "text",
        value: a,
        onChange: u,
        placeholder: o,
        className:
          "w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800",
      }),
      a &&
        f &&
        s.jsx("button", {
          onClick: f,
          className:
            "absolute right-3 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors",
          children: s.jsx(Jr, { className: "w-3.5 h-3.5" }),
        }),
    ],
  });
}
const zf = P.createContext(null);
function V0({ children: a }) {
  const [u, o] = P.useState(() => Je.user),
    [m, f] = P.useState(!!Je.access);
  (P.useEffect(() => {
    if (!Je.access) {
      f(!1);
      return;
    }
    let E = !1;
    return (
      yl
        .me()
        .then((N) => {
          E || (Je.save({ user: N }), o(N));
        })
        .catch(() => {
          E || (Je.clear(), o(null));
        })
        .finally(() => !E && f(!1)),
      () => {
        E = !0;
      }
    );
  }, []),
    P.useEffect(() => R0(() => o(null)), []));
  const h = P.useCallback(async (E) => {
      const N = await vl.login(E);
      return (Je.save(N), o(N.user), N.user);
    }, []),
    j = P.useCallback(async (E) => {
      const N = await vl.register(E);
      return (Je.save(N), o(N.user), N.user);
    }, []),
    y = P.useCallback(async () => {
      try {
        await vl.logout(Je.refresh);
      } catch {}
      (Je.clear(), o(null));
    }, []),
    g = P.useMemo(
      () => ({
        user: u,
        booting: m,
        isAuthenticated: !!u,
        login: h,
        register: j,
        logout: y,
        setUser: o,
      }),
      [u, m, h, j, y],
    );
  return s.jsx(zf.Provider, { value: g, children: a });
}
const At = () => {
    const a = P.useContext(zf);
    if (!a) throw new Error("useAuth must be used inside <AuthProvider>");
    return a;
  },
  Uu = ["2563eb", "0891b2", "7c3aed", "db2777", "ea580c", "059669"],
  Dt = (a = "?") => {
    const u = a
        .replace(/^Dr\.?\s*/i, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((h) => {
          var j;
          return ((j = h[0]) == null ? void 0 : j.toUpperCase()) ?? "";
        })
        .join(""),
      o = [...a].reduce((h, j) => h + j.charCodeAt(0), 0),
      f = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#${Uu[o % Uu.length]}"/><text x="50%" y="52%" dy=".35em" font-family="system-ui,sans-serif" font-size="52" font-weight="700" fill="#fff" text-anchor="middle">${u || "?"}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(f)}`;
  },
  ue = (a = "") =>
    String(a)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (u) => u.toUpperCase()),
  H0 = (a) =>
    a == null ? "Not listed" : `₹${Number(a).toLocaleString("en-IN")}`,
  Tf = (a) =>
    !a && a !== 0
      ? "--"
      : a < 1024
        ? `${a} B`
        : a < 1024 * 1024
          ? `${(a / 1024).toFixed(0)} KB`
          : `${(a / (1024 * 1024)).toFixed(1)} MB`,
  W0 = 1440 * 60 * 1e3,
  Ri = (a) => {
    if (!a) return "Date not set";
    const u = new Date(a);
    if (Number.isNaN(u.getTime())) return "Date not set";
    const o = u.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !0,
      }),
      m = (j) => new Date(j.getFullYear(), j.getMonth(), j.getDate()).getTime(),
      f = Math.round((m(u) - m(new Date())) / W0);
    return f === 0
      ? `Today, ${o}`
      : f === 1
        ? `Tomorrow, ${o}`
        : f === -1
          ? `Yesterday, ${o}`
          : `${u.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}, ${o}`;
  },
  Zr = (a) =>
    a
      ? new Date(a).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "--",
  Ai = (a) => {
    if (!a) return "";
    const u = Date.now() - new Date(a).getTime(),
      o = Math.round(u / 6e4);
    if (o < 1) return "Just now";
    if (o < 60) return `${o} min ago`;
    const m = Math.round(o / 60);
    if (m < 24) return `${m} ${m === 1 ? "hour" : "hours"} ago`;
    const f = Math.round(m / 24);
    return f === 1 ? "Yesterday" : f < 30 ? `${f} days ago` : Zr(a);
  },
  Pf = (a) => {
    var m, f;
    const u = ((m = a.doctor) == null ? void 0 : m.name) || "Assigned doctor",
      o = a.mode === "teleconsult";
    return {
      id: a._id,
      raw: a,
      doctor: u,
      specialty: a.reason || ue(a.mode),
      hospital:
        ((f = a.hospital) == null ? void 0 : f.name) ||
        (o ? "Video consultation" : "Clinic visit"),
      date: Ri(a.scheduledStart),
      time: a.scheduledStart,
      status: ue(a.status),
      mode: o ? "Video Consult" : "In-Clinic",
      fee: "",
      avatar: Dt(u),
    };
  },
  Q0 = (a) => {
    var m, f, h, j, y, g, E, N, S;
    const u = ((m = a.user) == null ? void 0 : m.name) || "Verified doctor",
      o =
        ((h = (f = a.hospitals) == null ? void 0 : f[0]) == null
          ? void 0
          : h.name) ||
        [
          (j = a.practiceLocation) == null ? void 0 : j.city,
          (y = a.practiceLocation) == null ? void 0 : y.district,
        ]
          .filter(Boolean)
          .join(", ") ||
        "Independent practice";
    return {
      id: ((g = a.user) == null ? void 0 : g._id) || a.user || a._id,
      profileId: a._id,
      raw: a,
      name: u,
      specialty:
        (E = a.specialties) != null && E[0]
          ? ue(a.specialties[0])
          : "General Physician",
      specialties: a.specialties || [],
      rating: Number(
        ((N = a.rating) == null ? void 0 : N.average) ?? 0,
      ).toFixed(1),
      reviews: ((S = a.rating) == null ? void 0 : S.count) ?? 0,
      experience: `${a.experienceYears ?? 0} yrs exp`,
      experienceYears: a.experienceYears ?? 0,
      hospital: o,
      status: a.acceptingNewPatients ? "Online" : "Offline",
      fee: H0(a.consultationFee),
      feeValue: a.consultationFee ?? null,
      modes: [...new Set((a.availability || []).map((_) => _.mode))],
      avatar: Dt(u),
    };
  },
  Rf = {
    prescription: "Prescriptions",
    lab_report: "Lab Reports",
    scan: "Scans",
    discharge_summary: "Discharge",
    insurance: "Insurance",
    id_proof: "ID Proof",
    certificate: "Vaccines",
    medicine_image: "Medicine",
    other: "Other",
  },
  Y0 = Object.entries(Rf).map(([a, u]) => ({ value: a, label: u })),
  q0 = (a) => {
    var u;
    return {
      id: a._id,
      raw: a,
      title: a.title,
      category: Rf[a.category] || ue(a.category),
      categoryKey: a.category,
      doctor: ((u = a.uploadedBy) == null ? void 0 : u.name) || "You",
      date: Zr(a.documentDate || a.createdAt),
      size: Tf(a.sizeBytes),
      mimeType: a.mimeType,
    };
  },
  K0 = (a) => {
    var j;
    const u = (j = a.doses) == null ? void 0 : j[0],
      { taken: o = 0, missed: m = 0, skipped: f = 0 } = a.adherence || {},
      h = o + m + f;
    return {
      id: a._id,
      raw: a,
      name: a.medicineName,
      dosage:
        (u == null ? void 0 : u.amount) ||
        (u == null ? void 0 : u.label) ||
        ue(a.status),
      time:
        (u == null ? void 0 : u.time) ||
        (a.nextTriggerAt ? Ri(a.nextTriggerAt) : "--"),
      taken: !!a.lastTriggeredAt && o > m,
      adherencePct: h ? Math.round((o / h) * 100) : null,
      nextTriggerAt: a.nextTriggerAt,
    };
  },
  G0 = {
    login: "Signed in",
    logout: "Signed out",
    create: "Record created",
    read: "Record viewed",
    update: "Record updated",
    delete: "Record deleted",
    upload: "Document uploaded",
    download: "Document downloaded",
    grant_consent: "Consent granted",
    revoke_consent: "Consent revoked",
  },
  X0 = (a) => {
    var u;
    return {
      id: a._id,
      title: G0[a.action] || ue(a.action),
      desc: `${ue(a.resourceType)}${(u = a.actor) != null && u.name ? ` by ${a.actor.name}` : ""}`,
      time: Ai(a.createdAt),
      outcome: a.outcome,
    };
  },
  J0 = (a, u, o) => {
    const m = u == null ? void 0 : u.address,
      f = [m == null ? void 0 : m.district, m == null ? void 0 : m.state]
        .filter(Boolean)
        .join(", "),
      h = ((o == null ? void 0 : o.allergies) || [])
        .map((j) => j.title)
        .filter(Boolean)
        .join(", ");
    return {
      name: (a == null ? void 0 : a.name) || "Your account",
      id: a != null && a._id ? a._id.slice(-8).toUpperCase() : "--------",
      email: (a == null ? void 0 : a.email) || "Not added",
      phone: (a == null ? void 0 : a.phone) || "--",
      bloodGroup: (u == null ? void 0 : u.bloodGroup) || "Not set",
      dob: u != null && u.dateOfBirth ? Zr(u.dateOfBirth) : "Not set",
      gender: u != null && u.gender ? ue(u.gender) : "Not set",
      city: f || "Not set",
      allergies: h || "None recorded",
      role: (a == null ? void 0 : a.role) || "patient",
      avatar: Dt((a == null ? void 0 : a.name) || "User"),
    };
  },
  Vu = ["New Delhi, NCR", "Mumbai, MH", "Bengaluru, KA", "Hyderabad, TS"];
function Z0({ onNavigateProfile: a, onGlobalSearch: u }) {
  var le;
  const { user: o } = At(),
    [m, f] = P.useState(""),
    [h, j] = P.useState(Vu[0]),
    [y, g] = P.useState(!1),
    [E, N] = P.useState(!1),
    { data: S, reload: _ } = $e(() => Bu.list({ limit: 8 }), []),
    R = S || [],
    $ =
      ((le = S == null ? void 0 : S.meta) == null ? void 0 : le.unread) ??
      R.filter((Z) => !Z.readAt).length,
    C = (Z) => {
      (f(Z.target.value), u == null || u(Z.target.value));
    },
    D = async () => {
      try {
        (await Bu.markAllRead(), await _());
      } catch {}
    },
    Q = (o == null ? void 0 : o.name) || "Your account",
    te = o != null && o._id ? o._id.slice(-8).toUpperCase() : "--------";
  return s.jsxs("header", {
    className:
      "h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs",
    children: [
      s.jsx("div", {
        className: "w-80",
        children: s.jsx(U0, {
          value: m,
          onChange: C,
          onClear: () => {
            (f(""), u == null || u(""));
          },
          placeholder: "Search doctors by name or specialty...",
        }),
      }),
      s.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          s.jsxs("div", {
            className: "relative",
            children: [
              s.jsxs("button", {
                onClick: () => g(!y),
                className:
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl",
                children: [
                  s.jsx(Kr, { className: "w-3.5 h-3.5 text-blue-600" }),
                  s.jsx("span", { children: h }),
                  s.jsx(pd, { className: "w-3.5 h-3.5 text-slate-400" }),
                ],
              }),
              y &&
                s.jsx("div", {
                  className:
                    "absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30",
                  children: Vu.map((Z) =>
                    s.jsxs(
                      "button",
                      {
                        onClick: () => {
                          (j(Z), g(!1));
                        },
                        className:
                          "w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 flex items-center justify-between",
                        children: [
                          s.jsx("span", { children: Z }),
                          Z === h &&
                            s.jsx(Mn, {
                              className: "w-3.5 h-3.5 text-blue-600",
                            }),
                        ],
                      },
                      Z,
                    ),
                  ),
                }),
            ],
          }),
          s.jsxs("div", {
            className: "relative",
            children: [
              s.jsxs("button", {
                onClick: () => N(!E),
                className:
                  "relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl",
                children: [
                  s.jsx(n0, { className: "w-4 h-4" }),
                  $ > 0 &&
                    s.jsx("span", {
                      className:
                        "absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white",
                    }),
                ],
              }),
              E &&
                s.jsxs("div", {
                  className:
                    "absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden",
                  children: [
                    s.jsxs("div", {
                      className:
                        "flex items-center justify-between px-3 py-2 border-b border-slate-100",
                      children: [
                        s.jsx("span", {
                          className: "text-xs font-bold text-slate-800",
                          children: "Notifications",
                        }),
                        $ > 0 &&
                          s.jsx("button", {
                            onClick: D,
                            className:
                              "text-[11px] font-semibold text-blue-600 hover:underline",
                            children: "Mark all read",
                          }),
                      ],
                    }),
                    R.length === 0
                      ? s.jsx("p", {
                          className:
                            "px-3 py-6 text-xs text-slate-500 text-center",
                          children: "Nothing yet.",
                        })
                      : s.jsx("ul", {
                          className: "max-h-72 overflow-y-auto",
                          children: R.map((Z) =>
                            s.jsxs(
                              "li",
                              {
                                className: `px-3 py-2 border-b border-slate-50 last:border-0 ${Z.readAt ? "opacity-60" : ""}`,
                                children: [
                                  s.jsx("p", {
                                    className:
                                      "text-xs font-semibold text-slate-800",
                                    children: Z.title,
                                  }),
                                  Z.body &&
                                    s.jsx("p", {
                                      className:
                                        "text-[11px] text-slate-500 truncate",
                                      children: Z.body,
                                    }),
                                  s.jsx("span", {
                                    className: "text-[10px] text-slate-400",
                                    children: Ai(Z.createdAt),
                                  }),
                                ],
                              },
                              Z._id,
                            ),
                          ),
                        }),
                  ],
                }),
            ],
          }),
          s.jsxs("button", {
            onClick: a,
            className:
              "flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-full text-left",
            children: [
              s.jsx("img", {
                src: Dt(Q),
                alt: "Profile",
                className:
                  "w-7 h-7 rounded-full object-cover ring-1 ring-blue-400",
              }),
              s.jsxs("div", {
                children: [
                  s.jsx("p", {
                    className: "text-xs font-bold text-slate-800 leading-none",
                    children: Q,
                  }),
                  s.jsxs("span", {
                    className: "text-[10px] text-blue-600 font-medium",
                    children: ["ABHA #", te],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function St({
  children: a,
  variant: u = "primary",
  size: o = "md",
  withArrow: m = !1,
  className: f = "",
  icon: h,
  ...j
}) {
  const y =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    g = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
      outline: "border border-slate-200 hover:bg-slate-50 text-slate-700",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200",
      ghost: "text-slate-600 hover:bg-slate-100",
    },
    E = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2.5",
    };
  return s.jsxs("button", {
    className: `${y} ${g[u] || g.primary} ${E[o]} ${f}`,
    ...j,
    children: [
      h && s.jsx(h, { className: "w-4 h-4 shrink-0" }),
      s.jsx("span", { children: a }),
      m &&
        s.jsx(Xp, {
          className: "w-4 h-4 transition-transform group-hover:translate-x-0.5",
        }),
    ],
  });
}
const eh = () => {
    const a = new Date().getHours();
    return a < 12 ? "Good Morning" : a < 17 ? "Good Afternoon" : "Good Evening";
  },
  th = (a) => (a || "there").trim().split(/\s+/)[0];
function nh({
  user: a,
  dashboard: u,
  upcoming: o,
  onBookClick: m,
  onRecordsClick: f,
}) {
  var E, N, S;
  const h =
      ((E = u == null ? void 0 : u.healthSummary) == null
        ? void 0
        : E.totalActive) ?? 0,
    j =
      (N = u == null ? void 0 : u.reminders) == null ? void 0 : N.adherenceRate,
    y =
      ((S = u == null ? void 0 : u.appointments) == null ? void 0 : S.count) ??
      0,
    g = o
      ? `You have ${y} consultation${y === 1 ? "" : "s"} coming up - next is ${o.date} with ${o.doctor}.`
      : "You have no consultations scheduled. Book one from Find Doctors whenever you need it.";
  return s.jsxs("div", {
    className:
      "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D2040] via-[#142E54] to-[#1E3A8A] text-white p-6 md:p-8 shadow-md",
    children: [
      s.jsxs("div", {
        className: "max-w-xl relative z-10",
        children: [
          s.jsxs("div", {
            className:
              "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-3",
            children: [
              s.jsx(E0, { className: "w-3.5 h-3.5 text-blue-300" }),
              s.jsx("span", {
                children: "Ayushman Bharat Digital Mission (ABDM) Sync Active",
              }),
            ],
          }),
          s.jsxs("h2", {
            className: "text-2xl md:text-3xl font-bold tracking-tight mb-2",
            children: [eh(), ", ", th(a == null ? void 0 : a.name), " 👋"],
          }),
          s.jsx("p", {
            className: "text-sm text-slate-300 leading-relaxed mb-6",
            children: g,
          }),
          s.jsxs("div", {
            className: "flex flex-wrap items-center gap-3",
            children: [
              s.jsx(St, {
                variant: "primary",
                icon: wl,
                onClick: m,
                children: "Schedule Visit",
              }),
              s.jsx(St, {
                variant: "outline",
                className: "text-white border-white/20 hover:bg-white/10",
                onClick: f,
                children: "View Health Locker",
              }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        className:
          "hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10",
        children: [
          s.jsx("div", {
            className:
              "w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400",
            children: s.jsx(Gr, { className: "w-7 h-7" }),
          }),
          s.jsxs("div", {
            children: [
              s.jsx("div", {
                className:
                  "text-xs uppercase tracking-wider text-slate-300 font-semibold",
                children: j == null ? "Health record" : "Medication adherence",
              }),
              s.jsx("div", {
                className: "text-xl font-bold text-white",
                children:
                  j == null
                    ? s.jsxs(s.Fragment, {
                        children: [
                          h,
                          " ",
                          s.jsxs("span", {
                            className: "text-xs font-normal text-slate-300",
                            children: [
                              "active ",
                              h === 1 ? "entry" : "entries",
                            ],
                          }),
                        ],
                      })
                    : s.jsxs(s.Fragment, {
                        children: [
                          j,
                          s.jsx("span", {
                            className: "text-xs font-normal text-emerald-300",
                            children: " %",
                          }),
                        ],
                      }),
              }),
              s.jsx("div", {
                className: "text-[11px] text-emerald-400",
                children:
                  h === 0 ? "No conditions recorded" : "Tracked in your record",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function rh({
  title: a,
  description: u,
  icon: o,
  badge: m,
  colorScheme: f = "blue",
  onClick: h,
}) {
  const j = {
      blue: {
        bg: "bg-blue-50/70 hover:bg-blue-50",
        border: "border-blue-100",
        iconBg: "bg-blue-600 text-white",
        text: "text-blue-900",
      },
      emerald: {
        bg: "bg-emerald-50/70 hover:bg-emerald-50",
        border: "border-emerald-100",
        iconBg: "bg-emerald-600 text-white",
        text: "text-emerald-900",
      },
      indigo: {
        bg: "bg-indigo-50/70 hover:bg-indigo-50",
        border: "border-indigo-100",
        iconBg: "bg-indigo-600 text-white",
        text: "text-indigo-900",
      },
      amber: {
        bg: "bg-amber-50/70 hover:bg-amber-50",
        border: "border-amber-100",
        iconBg: "bg-amber-600 text-white",
        text: "text-amber-900",
      },
    },
    y = j[f] || j.blue;
  return s.jsxs("div", {
    onClick: h,
    role: "button",
    className: `group relative p-5 rounded-2xl border ${y.bg} ${y.border} transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between`,
    children: [
      s.jsxs("div", {
        className: "flex items-start justify-between mb-4",
        children: [
          s.jsx("div", {
            className: `w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${y.iconBg}`,
            children: s.jsx(o, { className: "w-5 h-5" }),
          }),
          s.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              m &&
                s.jsx("span", {
                  className:
                    "text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs border border-slate-200",
                  children: m,
                }),
              s.jsx("div", {
                className:
                  "w-8 h-8 rounded-full bg-white/80 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-slate-900 transition-colors shadow-xs",
                children: s.jsx(Jp, {
                  className:
                    "w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                }),
              }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        children: [
          s.jsx("h3", {
            className: `font-bold text-sm mb-1 ${y.text}`,
            children: a,
          }),
          s.jsx("p", {
            className: "text-xs text-slate-500 leading-relaxed",
            children: u,
          }),
        ],
      }),
    ],
  });
}
function sh({ onNavigate: a, dashboard: u }) {
  var y, g, E, N, S, _;
  const o =
      ((g =
        (y = u == null ? void 0 : u.documents) == null ? void 0 : y.recent) ==
      null
        ? void 0
        : g.length) ?? 0,
    m =
      ((E = u == null ? void 0 : u.consents) == null ? void 0 : E.active) ?? 0,
    f =
      ((N = u == null ? void 0 : u.emergency) == null
        ? void 0
        : N.contactsConfigured) ?? 0,
    h =
      ((_ =
        (S = u == null ? void 0 : u.emergency) == null
          ? void 0
          : S.openRequests) == null
        ? void 0
        : _.length) ?? 0,
    j = [
      {
        title: "Consult Specialist",
        description: "Book a video or in-clinic visit with a verified doctor.",
        icon: Pi,
        colorScheme: "blue",
        badge: "Browse",
        tab: "doctors",
      },
      {
        title: "Medical Records",
        description: "Prescriptions, lab reports and scans in one place.",
        icon: f0,
        colorScheme: "indigo",
        badge: o ? `${o} recent` : "Empty",
        tab: "records",
      },
      {
        title: "ABHA Health Locker",
        description: "Encrypted vault with consent-gated clinician access.",
        icon: Gr,
        colorScheme: "emerald",
        badge: m ? `${m} consent${m === 1 ? "" : "s"}` : "No consents",
        tab: "records",
      },
      {
        title: "Emergency Assistance",
        description: "Ambulance dispatch and trauma desk via SOS.",
        icon: df,
        colorScheme: "amber",
        badge: h
          ? `${h} open`
          : f
            ? `${f} contact${f === 1 ? "" : "s"}`
            : "Add a contact",
        tab: "profile",
      },
    ];
  return s.jsx("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6",
    children: j.map((R) =>
      s.jsx(
        rh,
        {
          title: R.title,
          description: R.description,
          icon: R.icon,
          colorScheme: R.colorScheme,
          badge: R.badge,
          onClick: () => a(R.tab),
        },
        R.title,
      ),
    ),
  });
}
const Hu = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-teal-50 text-teal-700 border-teal-200",
  online: "bg-emerald-50 text-emerald-600 border-emerald-200",
  offline: "bg-slate-100 text-slate-500 border-slate-200",
  cancelled: "bg-rose-50 text-rose-600 border-rose-200",
  urgent: "bg-rose-100 text-rose-700 border-rose-300 animate-pulse",
  primary: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};
function es({ children: a, variant: u = "default", className: o = "" }) {
  const m = Hu[u.toLowerCase()] || Hu.default;
  return s.jsxs("span", {
    className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${m} ${o}`,
    children: [
      u.toLowerCase() === "online" &&
        s.jsx("span", {
          className:
            "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block",
        }),
      a,
    ],
  });
}
function lh({ appointment: a, onJoinCall: u, onViewAll: o }) {
  return a
    ? s.jsxs("div", {
        className:
          "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between",
        children: [
          s.jsxs("div", {
            className:
              "flex items-center justify-between pb-3 border-b border-slate-100",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  s.jsx("div", {
                    className:
                      "w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center",
                    children: s.jsx(wl, { className: "w-4 h-4" }),
                  }),
                  s.jsxs("div", {
                    children: [
                      s.jsx("span", {
                        className: "text-xs font-bold text-slate-900",
                        children: "Upcoming Visit",
                      }),
                      s.jsx("p", {
                        className: "text-[11px] text-slate-500",
                        children: "Confirmed booking",
                      }),
                    ],
                  }),
                ],
              }),
              s.jsx(es, { variant: "confirmed", children: a.status }),
            ],
          }),
          s.jsxs("div", {
            className: "flex items-center gap-3.5 my-4",
            children: [
              s.jsx("img", {
                src: a.avatar,
                alt: a.doctor,
                className:
                  "w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100",
              }),
              s.jsxs("div", {
                className: "flex-1 min-w-0",
                children: [
                  s.jsx("h4", {
                    className: "text-sm font-bold text-slate-900 truncate",
                    children: a.doctor,
                  }),
                  s.jsx("p", {
                    className: "text-xs text-blue-600 font-medium",
                    children: a.specialty,
                  }),
                  s.jsx("p", {
                    className: "text-[11px] text-slate-400 truncate",
                    children: a.hospital,
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            className:
              "bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600 mb-4",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-1.5 font-medium",
                children: [
                  s.jsx(qr, { className: "w-3.5 h-3.5 text-blue-600" }),
                  s.jsx("span", { children: a.date }),
                ],
              }),
              s.jsx("span", {
                className: "font-semibold text-slate-700",
                children: a.mode,
              }),
            ],
          }),
          s.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              s.jsx(St, {
                variant: "primary",
                size: "sm",
                icon: Pi,
                className: "flex-1",
                onClick: u,
                children: "Join Call",
              }),
              s.jsxs("button", {
                onClick: o,
                className:
                  "p-2 text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1",
                children: [
                  s.jsx("span", { children: "All" }),
                  " ",
                  s.jsx(a0, { className: "w-3.5 h-3.5" }),
                ],
              }),
            ],
          }),
        ],
      })
    : null;
}
function ah({
  checked: a = !1,
  onChange: u,
  label: o = "",
  size: m = "md",
  disabled: f = !1,
}) {
  const h = m === "sm";
  return s.jsxs("label", {
    className: `inline-flex items-center gap-2.5 cursor-pointer select-none ${f ? "opacity-50 cursor-not-allowed" : ""}`,
    children: [
      s.jsx("button", {
        type: "button",
        role: "switch",
        "aria-checked": a,
        disabled: f,
        onClick: () => !f && (u == null ? void 0 : u(!a)),
        className: `relative inline-flex shrink-0 transition-colors duration-200 ease-in-out rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${h ? "h-5 w-9" : "h-6 w-11"} ${a ? "bg-emerald-500" : "bg-slate-200"}`,
        children: s.jsx("span", {
          className: `inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${h ? (a ? "translate-x-4 h-4 w-4" : "translate-x-0 h-4 w-4") : a ? "translate-x-5 h-5 w-5" : "translate-x-0 h-5 w-5"}`,
        }),
      }),
      o &&
        s.jsx("span", {
          className: "text-xs font-medium text-slate-600",
          children: o,
        }),
    ],
  });
}
function He({ label: a = "Loading...", className: u = "" }) {
  return s.jsxs("div", {
    className: `flex items-center justify-center gap-2 py-10 text-slate-500 ${u}`,
    children: [
      s.jsx(ht, { className: "w-4 h-4 animate-spin text-blue-600" }),
      s.jsx("span", { className: "text-xs font-medium", children: a }),
    ],
  });
}
function Ze({ error: a, onRetry: u, className: o = "" }) {
  var f;
  const m =
    (f = a == null ? void 0 : a.fieldMessages) != null && f.length
      ? a.fieldMessages
      : [];
  return s.jsxs("div", {
    className: `bg-white rounded-2xl border border-rose-200 p-6 text-center space-y-3 ${o}`,
    children: [
      s.jsx("div", {
        className:
          "w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto",
        children: s.jsx(wf, { className: "w-5 h-5" }),
      }),
      s.jsxs("div", {
        children: [
          s.jsx("h4", {
            className: "text-sm font-bold text-slate-900",
            children: "Could not load this",
          }),
          s.jsx("p", {
            className: "text-xs text-slate-500 mt-1",
            children:
              (a == null ? void 0 : a.message) || "Something went wrong.",
          }),
          m.length > 0 &&
            s.jsx("ul", {
              className: "text-[11px] text-rose-600 mt-2 space-y-0.5",
              children: m.map((h) => s.jsx("li", { children: h }, h)),
            }),
        ],
      }),
      u &&
        s.jsxs("button", {
          onClick: u,
          className:
            "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors",
          children: [s.jsx(b0, { className: "w-3.5 h-3.5" }), "Try again"],
        }),
    ],
  });
}
function Lt({
  title: a,
  description: u,
  action: o,
  icon: m = g0,
  className: f = "",
}) {
  return s.jsxs("div", {
    className: `bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 ${f}`,
    children: [
      s.jsx("div", {
        className:
          "w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto",
        children: s.jsx(m, { className: "w-5 h-5" }),
      }),
      s.jsxs("div", {
        children: [
          s.jsx("h4", {
            className: "text-sm font-bold text-slate-900",
            children: a,
          }),
          u &&
            s.jsx("p", {
              className: "text-xs text-slate-500 mt-1 max-w-sm mx-auto",
              children: u,
            }),
        ],
      }),
      o,
    ],
  });
}
function ih({ initial: a = [] }) {
  var E, N;
  const [u, o] = P.useState(() => (a || []).map(K0)),
    [m, f] = P.useState(null),
    h = async (S) => {
      const _ = S.taken ? "skipped" : "taken";
      (f(S.id),
        o((R) =>
          R.map(($) => ($.id === S.id ? { ...$, taken: !$.taken } : $)),
        ));
      try {
        await $0.recordAdherence(S.id, _);
      } catch (R) {
        (o(($) => $.map((C) => (C.id === S.id ? { ...C, taken: S.taken } : C))),
          alert(R.message));
      } finally {
        f(null);
      }
    },
    j = u.filter((S) => S.taken).length,
    y = (E = u.find((S) => !S.taken)) == null ? void 0 : E.time,
    g =
      (N = u.find((S) => S.adherencePct !== null)) == null
        ? void 0
        : N.adherencePct;
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between",
    children: [
      s.jsxs("div", {
        className:
          "flex items-center justify-between pb-3 border-b border-slate-100",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              s.jsx("div", {
                className:
                  "w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center",
                children: s.jsx(j0, { className: "w-4 h-4" }),
              }),
              s.jsxs("div", {
                children: [
                  s.jsx("h4", {
                    className: "text-xs font-bold text-slate-900",
                    children: "Medication Routine",
                  }),
                  s.jsx("p", {
                    className: "text-[11px] text-slate-500",
                    children: "Daily adherence tracker",
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            className:
              "flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200",
            children: [
              s.jsx(jl, { className: "w-3 h-3" }),
              s.jsxs("span", { children: [j, "/", u.length, " Taken"] }),
            ],
          }),
        ],
      }),
      u.length === 0
        ? s.jsx(Lt, {
            title: "No active reminders",
            description:
              "Medicine reminders appear once a prescription is added to your record.",
            className: "border-0 shadow-none p-6",
          })
        : s.jsxs(s.Fragment, {
            children: [
              s.jsx("div", {
                className: "space-y-3 my-3",
                children: u.map((S) =>
                  s.jsxs(
                    "div",
                    {
                      className: `flex items-center justify-between p-2.5 rounded-xl border transition-all ${S.taken ? "bg-slate-50/70 border-slate-200 opacity-75" : "bg-white border-slate-200/90 shadow-xs"} ${m === S.id ? "opacity-50 pointer-events-none" : ""}`,
                      children: [
                        s.jsxs("div", {
                          className: "min-w-0 pr-2",
                          children: [
                            s.jsx("p", {
                              className: `text-xs font-bold truncate ${S.taken ? "line-through text-slate-400" : "text-slate-800"}`,
                              children: S.name,
                            }),
                            s.jsxs("div", {
                              className:
                                "flex items-center gap-2 text-[10px] text-slate-500 mt-0.5",
                              children: [
                                s.jsx("span", { children: S.dosage }),
                                s.jsx("span", { children: "•" }),
                                s.jsx("span", {
                                  className: "font-semibold text-blue-600",
                                  children: S.time,
                                }),
                              ],
                            }),
                          ],
                        }),
                        s.jsx(ah, {
                          size: "sm",
                          checked: S.taken,
                          onChange: () => h(S),
                        }),
                      ],
                    },
                    S.id,
                  ),
                ),
              }),
              s.jsxs("div", {
                className:
                  "pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400",
                children: [
                  s.jsx("span", {
                    children: y
                      ? `Next dosage due at ${y}`
                      : "All doses logged",
                  }),
                  g != null &&
                    s.jsxs("span", {
                      className: "text-emerald-600 font-medium",
                      children: [g, "% Compliance"],
                    }),
                ],
              }),
            ],
          }),
    ],
  });
}
function oh() {
  const { data: a, loading: u } = $e(() => O0.list({ limit: 6 }), []),
    o = (a || []).map(X0);
  return s.jsxs("div", {
    className: "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs",
    children: [
      s.jsxs("div", {
        className: "flex items-center justify-between mb-4",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              s.jsx(k0, { className: "w-4 h-4 text-slate-500" }),
              s.jsx("h3", {
                className: "text-sm font-bold text-slate-900",
                children: "Recent Health Activity",
              }),
            ],
          }),
          s.jsx("span", {
            className: "text-[11px] font-medium text-slate-400",
            children: "ABDM Audit Log",
          }),
        ],
      }),
      u
        ? s.jsx(He, { label: "Reading audit trail..." })
        : o.length === 0
          ? s.jsx("p", {
              className: "text-xs text-slate-500 py-4 text-center",
              children: "No recorded activity yet.",
            })
          : s.jsx("div", {
              className: "grid grid-cols-1 md:grid-cols-3 gap-3",
              children: o.map((m) =>
                s.jsxs(
                  "div",
                  {
                    className:
                      "flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors",
                    children: [
                      s.jsx("div", {
                        className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${m.outcome === "success" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`,
                        children: s.jsx(ed, { className: "w-4 h-4" }),
                      }),
                      s.jsxs("div", {
                        className: "min-w-0 flex-1",
                        children: [
                          s.jsxs("div", {
                            className:
                              "flex items-center justify-between gap-1 mb-0.5",
                            children: [
                              s.jsx("h4", {
                                className:
                                  "text-xs font-bold text-slate-800 truncate",
                                children: m.title,
                              }),
                              s.jsxs("span", {
                                className:
                                  "text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5",
                                children: [
                                  s.jsx(qr, { className: "w-2.5 h-2.5" }),
                                  m.time,
                                ],
                              }),
                            ],
                          }),
                          s.jsx("p", {
                            className: "text-[11px] text-slate-500 truncate",
                            children: m.desc,
                          }),
                        ],
                      }),
                    ],
                  },
                  m.id,
                ),
              ),
            }),
    ],
  });
}
function Wu({ onNavigate: a }) {
  var g, E, N;
  const { user: u } = At(),
    { data: o, error: m, loading: f, reload: h } = $e(() => Yr.dashboard(), []);
  if (f) return s.jsx(He, { label: "Loading your health summary..." });
  if (m) return s.jsx(Ze, { error: m, onRetry: h });
  const j =
      ((E =
        (g = o == null ? void 0 : o.appointments) == null
          ? void 0
          : g.upcoming) == null
        ? void 0
        : E[0]) || null,
    y = j ? Pf(j) : null;
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(nh, {
        user: u,
        dashboard: o,
        upcoming: y,
        onBookClick: () => a("doctors"),
        onRecordsClick: () => a("records"),
      }),
      s.jsxs("div", {
        children: [
          s.jsx("h3", {
            className: "text-base font-bold text-slate-900 tracking-tight mb-2",
            children: "Quick Services",
          }),
          s.jsx(sh, { onNavigate: a, dashboard: o }),
        ],
      }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        children: [
          y
            ? s.jsx(lh, {
                appointment: y,
                onJoinCall: () =>
                  alert(
                    y.mode === "Video Consult"
                      ? `Telehealth room for ${y.doctor} opens at ${y.date}.`
                      : `This is an in-clinic visit at ${y.hospital}.`,
                  ),
                onViewAll: () => a("appointments"),
              })
            : s.jsx(Lt, {
                title: "No upcoming visits",
                description:
                  "Book a consultation with a verified specialist to see it here.",
                action: s.jsx("button", {
                  onClick: () => a("doctors"),
                  className: "text-xs font-bold text-blue-600 hover:underline",
                  children: "Find a doctor",
                }),
              }),
          s.jsx(ih, {
            initial:
              (N = o == null ? void 0 : o.reminders) == null
                ? void 0
                : N.active,
          }),
        ],
      }),
      s.jsx(oh, {}),
    ],
  });
}
function xt({
  title: a,
  description: u,
  badgeText: o,
  badgeVariant: m = "primary",
  children: f,
}) {
  return s.jsxs("div", {
    className:
      "relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DCEBFF] via-[#EBF3FE] to-white border border-blue-100 p-6 shadow-xs mb-6",
    children: [
      s.jsxs("div", {
        className:
          "flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10",
        children: [
          s.jsxs("div", {
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2.5 mb-1.5",
                children: [
                  s.jsx("h1", {
                    className:
                      "text-xl md:text-2xl font-extrabold text-[#0D2040] tracking-tight",
                    children: a,
                  }),
                  o && s.jsx(es, { variant: m, children: o }),
                ],
              }),
              s.jsx("p", {
                className: "text-sm text-slate-600 max-w-2xl leading-relaxed",
                children: u,
              }),
            ],
          }),
          f &&
            s.jsx("div", {
              className: "flex items-center gap-3 shrink-0",
              children: f,
            }),
        ],
      }),
      s.jsx("div", {
        className:
          "absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-blue-400/10 pointer-events-none blur-2xl",
      }),
      s.jsx("div", {
        className:
          "absolute right-32 -top-8 w-24 h-24 rounded-full bg-indigo-300/15 pointer-events-none blur-xl",
      }),
    ],
  });
}
function Di({
  label: a,
  value: u,
  change: o,
  color: m = "text-blue-600",
  bg: f = "bg-blue-50",
  icon: h = tr,
}) {
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between",
    children: [
      s.jsxs("div", {
        children: [
          s.jsx("p", {
            className:
              "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1",
            children: a,
          }),
          s.jsxs("div", {
            className: "flex items-baseline gap-2",
            children: [
              s.jsx("span", {
                className: "text-2xl font-black text-slate-900 tracking-tight",
                children: u,
              }),
              s.jsx("span", {
                className: "text-[11px] font-semibold text-slate-400",
                children: o,
              }),
            ],
          }),
        ],
      }),
      s.jsx("div", {
        className: `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f} ${m}`,
        children: s.jsx(h, { className: "w-6 h-6" }),
      }),
    ],
  });
}
const ch = ["Requested", "Confirmed", "Rescheduled"];
function uh({ appointment: a, onReschedule: u, onCancel: o, onJoin: m }) {
  const f = ch.includes(a.status),
    h = a.mode === "Video Consult";
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
    children: [
      s.jsxs("div", {
        className: "flex items-start gap-4",
        children: [
          s.jsx("img", {
            src: a.avatar,
            alt: a.doctor,
            className:
              "w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0",
          }),
          s.jsxs("div", {
            className: "space-y-1",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  s.jsx("h3", {
                    className: "font-bold text-slate-900 text-base",
                    children: a.doctor,
                  }),
                  s.jsx(es, {
                    variant: f ? "confirmed" : "completed",
                    children: a.status,
                  }),
                ],
              }),
              s.jsx("p", {
                className: "text-xs font-semibold text-blue-600",
                children: a.specialty,
              }),
              s.jsxs("div", {
                className:
                  "flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1",
                children: [
                  s.jsxs("span", {
                    className:
                      "flex items-center gap-1 font-medium text-slate-700",
                    children: [
                      s.jsx(qr, { className: "w-3.5 h-3.5 text-blue-500" }),
                      a.date,
                    ],
                  }),
                  s.jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [
                      s.jsx(Kr, { className: "w-3.5 h-3.5 text-slate-400" }),
                      a.hospital,
                    ],
                  }),
                  s.jsx("span", {
                    className:
                      "px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium",
                    children: a.mode,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      f &&
        s.jsxs("div", {
          className:
            "flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0",
          children: [
            h &&
              s.jsx(St, {
                variant: "primary",
                size: "sm",
                icon: Pi,
                onClick: () => m(a),
                children: "Join Video",
              }),
            s.jsx(St, {
              variant: "outline",
              size: "sm",
              onClick: () => u(a),
              children: "Reschedule",
            }),
            s.jsx("button", {
              onClick: () => o(a.id),
              className:
                "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors",
              title: "Cancel booking",
              children: s.jsx(yd, { className: "w-4 h-4" }),
            }),
          ],
        }),
    ],
  });
}
function dh({ onBrowseDoctors: a }) {
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4",
    children: [
      s.jsxs("div", {
        className:
          "flex items-center justify-between pb-3 border-b border-slate-100",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              s.jsx(wl, { className: "w-4 h-4 text-blue-600" }),
              s.jsx("h4", {
                className: "text-xs font-bold text-slate-900",
                children: "Book a new consultation",
              }),
            ],
          }),
          s.jsx(i0, { className: "w-3.5 h-3.5 text-slate-400" }),
        ],
      }),
      s.jsx("p", {
        className: "text-xs text-slate-500",
        children:
          "Pick a verified specialist to see the slots they have actually published for the next seven days.",
      }),
      s.jsxs("div", {
        className: "space-y-2 text-[11px] text-slate-600",
        children: [
          s.jsxs("div", {
            className: "flex items-start gap-2",
            children: [
              s.jsx(Xr, {
                className: "w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0",
              }),
              s.jsx("span", {
                children: "Filter by specialty, fee, experience or district.",
              }),
            ],
          }),
          s.jsxs("div", {
            className: "flex items-start gap-2",
            children: [
              s.jsx(Gr, {
                className: "w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0",
              }),
              s.jsx("span", {
                children:
                  "Only admin-verified doctors appear in search results.",
              }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        className:
          "p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800",
        children: [
          s.jsx("p", {
            className: "font-semibold",
            children: "Video and in-clinic supported",
          }),
          s.jsx("p", {
            className: "text-blue-600",
            children: "Choose the mode when you confirm the slot.",
          }),
        ],
      }),
      s.jsx(St, {
        variant: "primary",
        className: "w-full text-xs font-bold",
        onClick: a,
        children: "Find a specialist",
      }),
    ],
  });
}
function fh({ onNavigateDoctors: a }) {
  const [u, o] = P.useState(null),
    {
      data: m,
      error: f,
      loading: h,
      reload: j,
    } = $e(() => Qr.mine({ limit: 50 }), []),
    y = P.useMemo(() => (m || []).map(Pf), [m]),
    g = P.useMemo(() => {
      const R = ($) => (m || []).filter((C) => $.includes(C.status)).length;
      return [
        {
          label: "Upcoming",
          value: R(["requested", "confirmed", "rescheduled"]),
          change: "Scheduled",
          color: "text-blue-600",
          bg: "bg-blue-50",
          icon: tr,
        },
        {
          label: "Completed",
          value: R(["completed"]),
          change: "All time",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          icon: jl,
        },
        {
          label: "Cancelled",
          value: R(["cancelled", "rejected"]),
          change: "All time",
          color: "text-rose-600",
          bg: "bg-rose-50",
          icon: yd,
        },
        {
          label: "Total Visits",
          value: (m || []).length,
          change: "Lifetime",
          color: "text-purple-600",
          bg: "bg-purple-50",
          icon: ed,
        },
      ];
    }, [m]),
    E = g[0].value,
    N = async (R) => {
      const $ = prompt("Reason for cancelling (optional):");
      if ($ !== null) {
        o(R);
        try {
          (await Qr.cancel(R, $ || void 0), await j());
        } catch (C) {
          alert(C.message);
        } finally {
          o(null);
        }
      }
    },
    S = async (R) => {
      const $ = prompt(
        "New date and time (YYYY-MM-DD HH:mm):",
        new Date(R.time).toISOString().slice(0, 16).replace("T", " "),
      );
      if (!$) return;
      const C = new Date($.replace(" ", "T"));
      if (Number.isNaN(C.getTime())) {
        alert("Could not read that date. Use the format 2026-11-20 15:30");
        return;
      }
      o(R.id);
      try {
        (await Qr.reschedule(R.id, { scheduledStart: C.toISOString() }),
          await j());
      } catch (D) {
        alert(D.message);
      } finally {
        o(null);
      }
    },
    _ = (R) =>
      alert(
        R.mode === "Video Consult"
          ? `Telehealth room for ${R.doctor} opens at ${R.date}.`
          : `In-clinic visit at ${R.hospital}.`,
      );
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Consultation & Appointments",
        description:
          "Review your upcoming clinical sessions, join encrypted tele-consultations, or reschedule visits.",
        badgeText: `${E} Upcoming`,
      }),
      s.jsx("div", {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        children: g.map((R) => s.jsx(Di, { ...R }, R.label)),
      }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        children: [
          s.jsxs("div", {
            className: "lg:col-span-2 space-y-4",
            children: [
              s.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  s.jsx("h3", {
                    className: "text-base font-bold text-slate-900",
                    children: "Your Appointment Schedule",
                  }),
                  s.jsx("button", {
                    onClick: a,
                    className:
                      "text-xs font-bold text-blue-600 hover:underline",
                    children: "+ Book New Doctor",
                  }),
                ],
              }),
              h
                ? s.jsx(He, { label: "Loading appointments..." })
                : f
                  ? s.jsx(Ze, { error: f, onRetry: j })
                  : y.length === 0
                    ? s.jsx(Lt, {
                        title: "No appointments yet",
                        description:
                          "Book a consultation and it will show up here with join and reschedule controls.",
                        action: s.jsx("button", {
                          onClick: a,
                          className:
                            "text-xs font-bold text-blue-600 hover:underline",
                          children: "Browse specialists",
                        }),
                      })
                    : s.jsx("div", {
                        className: "space-y-3",
                        children: y.map((R) =>
                          s.jsx(
                            "div",
                            {
                              className:
                                u === R.id
                                  ? "opacity-50 pointer-events-none"
                                  : "",
                              children: s.jsx(uh, {
                                appointment: R,
                                onCancel: N,
                                onReschedule: S,
                                onJoin: _,
                              }),
                            },
                            R.id,
                          ),
                        ),
                      }),
            ],
          }),
          s.jsx("div", { children: s.jsx(dh, { onBrowseDoctors: a }) }),
        ],
      }),
    ],
  });
}
function mh({
  searchTerm: a,
  onSearchChange: u,
  activeFilterPill: o,
  onSelectPill: m,
  resultCount: f = 0,
}) {
  const h = [
    "All",
    "Top Rated (4.8+)",
    "Under ₹1200",
    "Video Consult Available",
  ];
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3",
    children: [
      s.jsxs("div", {
        className: "flex flex-col sm:flex-row items-center gap-3",
        children: [
          s.jsxs("div", {
            className: "relative flex-1 w-full",
            children: [
              s.jsx(Ti, {
                className:
                  "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none",
              }),
              s.jsx("input", {
                type: "text",
                value: a,
                onChange: (j) => u(j.target.value),
                placeholder: "Search doctor by name, symptom or condition...",
                className:
                  "w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white",
              }),
            ],
          }),
          s.jsxs("div", {
            className:
              "flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 font-medium shrink-0",
            children: [
              s.jsx(_0, { className: "w-3.5 h-3.5 text-blue-600" }),
              s.jsxs("span", {
                children: [
                  "Showing ",
                  s.jsx("strong", { className: "text-slate-800", children: f }),
                  " doctors",
                ],
              }),
            ],
          }),
        ],
      }),
      s.jsx("div", {
        className: "flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar",
        children: h.map((j) => {
          const y = o === j;
          return s.jsx(
            "button",
            {
              onClick: () => m(j),
              className: `px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${y ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: j,
            },
            j,
          );
        }),
      }),
    ],
  });
}
const ph = ["All"],
  hh = ["All", "5+ Years", "10+ Years", "15+ Years"];
function xh({
  selectedSpecialty: a,
  onSelectSpecialty: u,
  selectedExp: o,
  onSelectExp: m,
  onlyOnline: f,
  onToggleOnline: h,
  onReset: j,
  specialties: y = ph,
}) {
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4",
    children: [
      s.jsxs("div", {
        className:
          "flex items-center justify-between pb-3 border-b border-slate-100",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              s.jsx(m0, { className: "w-4 h-4 text-blue-600" }),
              s.jsx("h3", {
                className: "text-sm font-bold text-slate-900",
                children: "Filters",
              }),
            ],
          }),
          s.jsxs("button", {
            onClick: j,
            className:
              "text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1",
            children: [s.jsx(S0, { className: "w-3 h-3" }), " Reset"],
          }),
        ],
      }),
      s.jsxs("div", {
        children: [
          s.jsx("label", {
            className:
              "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2",
            children: "Specialization",
          }),
          s.jsx("div", {
            className: "space-y-1",
            children: y.map((g) =>
              s.jsxs(
                "label",
                {
                  className:
                    "flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-50 cursor-pointer",
                  children: [
                    s.jsx("input", {
                      type: "radio",
                      name: "spec",
                      checked: a === g,
                      onChange: () => u(g),
                      className: "text-blue-600 w-3.5 h-3.5",
                    }),
                    s.jsx("span", {
                      className:
                        a === g ? "font-bold text-blue-600" : "text-slate-600",
                      children: g,
                    }),
                  ],
                },
                g,
              ),
            ),
          }),
        ],
      }),
      s.jsxs("div", {
        className: "pt-2 border-t border-slate-100",
        children: [
          s.jsx("label", {
            className:
              "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2",
            children: "Experience",
          }),
          s.jsx("div", {
            className: "space-y-1",
            children: hh.map((g) =>
              s.jsxs(
                "label",
                {
                  className:
                    "flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-50 cursor-pointer",
                  children: [
                    s.jsx("input", {
                      type: "radio",
                      name: "exp",
                      checked: o === g,
                      onChange: () => m(g),
                      className: "text-blue-600 w-3.5 h-3.5",
                    }),
                    s.jsx("span", {
                      className:
                        o === g ? "font-bold text-blue-600" : "text-slate-600",
                      children: g,
                    }),
                  ],
                },
                g,
              ),
            ),
          }),
        ],
      }),
      s.jsx("div", {
        className: "pt-2 border-t border-slate-100",
        children: s.jsxs("label", {
          className:
            "flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer hover:bg-slate-50",
          children: [
            s.jsx("span", {
              className: "text-slate-700 font-semibold",
              children: "Available Online Now",
            }),
            s.jsx("input", {
              type: "checkbox",
              checked: f,
              onChange: (g) => h(g.target.checked),
              className: "rounded text-blue-600 w-4 h-4",
            }),
          ],
        }),
      }),
    ],
  });
}
function gh({ doctor: a, onBook: u }) {
  const o = a.status === "Online";
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between",
    children: [
      s.jsxs("div", {
        children: [
          s.jsxs("div", {
            className: "flex items-start gap-3.5 mb-3",
            children: [
              s.jsxs("div", {
                className: "relative",
                children: [
                  s.jsx("img", {
                    src: a.avatar,
                    alt: a.name,
                    className:
                      "w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100",
                  }),
                  s.jsx("span", {
                    className: `absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${o ? "bg-emerald-500" : "bg-slate-400"}`,
                  }),
                ],
              }),
              s.jsxs("div", {
                className: "flex-1 min-w-0",
                children: [
                  s.jsxs("div", {
                    className: "flex items-center justify-between gap-1",
                    children: [
                      s.jsx("h3", {
                        className: "font-bold text-slate-900 text-sm truncate",
                        children: a.name,
                      }),
                      s.jsx(es, {
                        variant: o ? "online" : "offline",
                        children: a.status,
                      }),
                    ],
                  }),
                  s.jsx("p", {
                    className: "text-xs font-semibold text-blue-600 mt-0.5",
                    children: a.specialty,
                  }),
                  s.jsxs("div", {
                    className:
                      "flex items-center gap-1.5 text-xs text-slate-500 mt-1",
                    children: [
                      s.jsx(Zp, { className: "w-3.5 h-3.5 text-amber-500" }),
                      s.jsx("span", { children: a.experience }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            className:
              "text-xs text-slate-500 flex items-center gap-1 mb-4 truncate",
            children: [
              s.jsx(Kr, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
              s.jsx("span", { className: "truncate", children: a.hospital }),
            ],
          }),
          s.jsxs("div", {
            className:
              "flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-4",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-1",
                children: [
                  s.jsx(hf, {
                    className: "w-4 h-4 fill-amber-400 text-amber-400",
                  }),
                  s.jsx("span", {
                    className: "text-xs font-bold text-slate-800",
                    children: a.rating,
                  }),
                  s.jsxs("span", {
                    className: "text-[11px] text-slate-400",
                    children: ["(", a.reviews, ")"],
                  }),
                ],
              }),
              s.jsxs("div", {
                className: "text-right",
                children: [
                  s.jsx("span", {
                    className: "text-[10px] text-slate-400 block leading-none",
                    children: "Consultation Fee",
                  }),
                  s.jsx("span", {
                    className: "text-xs font-bold text-slate-900",
                    children: a.fee,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        className: "flex items-center gap-2 pt-2",
        children: [
          s.jsx(St, {
            variant: "outline",
            size: "sm",
            className: "flex-1 text-xs",
            onClick: () => u(a),
            children: "Profile",
          }),
          s.jsx(St, {
            variant: "primary",
            size: "sm",
            className: "flex-1 text-xs font-semibold",
            onClick: () => u(a),
            children: "Book Visit",
          }),
        ],
      }),
    ],
  });
}
const Qu = () => new Date().toISOString().slice(0, 10);
function vh({ doctor: a, onClose: u, onBooked: o }) {
  const [m, f] = P.useState(Qu()),
    [h, j] = P.useState(""),
    [y, g] = P.useState(null),
    [E, N] = P.useState(""),
    [S, _] = P.useState(!1),
    [R, $] = P.useState(null),
    {
      data: C,
      error: D,
      loading: Q,
      reload: te,
    } = $e(() => Mf.slots(a.id, m, h || void 0), [m, h]),
    Z = ((C == null ? void 0 : C.slots) || []).filter((ee) => ee.available),
    be = async () => {
      if (!(!y || E.trim().length < 3)) {
        (_(!0), $(null));
        try {
          (await Qr.book({
            doctor: a.id,
            scheduledStart: y.start,
            mode: y.mode,
            reason: E.trim(),
          }),
            o == null || o());
        } catch (ee) {
          $(ee);
        } finally {
          _(!1);
        }
      }
    };
  return s.jsx("div", {
    className:
      "fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4",
    children: s.jsxs("div", {
      className:
        "bg-white rounded-3xl p-6 max-w-md w-full relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto",
      children: [
        s.jsx("button", {
          onClick: u,
          className:
            "absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400",
          children: s.jsx(Jr, { className: "w-5 h-5" }),
        }),
        s.jsxs("div", {
          className: "flex items-center gap-3 mb-5",
          children: [
            s.jsx("img", {
              src: a.avatar,
              alt: a.name,
              className: "w-12 h-12 rounded-2xl",
            }),
            s.jsxs("div", {
              children: [
                s.jsx("h3", {
                  className: "font-bold text-slate-900 text-sm",
                  children: a.name,
                }),
                s.jsx("p", {
                  className: "text-xs text-blue-600 font-semibold",
                  children: a.specialty,
                }),
                s.jsxs("p", {
                  className: "text-[11px] text-slate-400",
                  children: [a.fee, " consultation"],
                }),
              ],
            }),
          ],
        }),
        s.jsxs("div", {
          className: "grid grid-cols-2 gap-3 mb-4",
          children: [
            s.jsxs("label", {
              className: "block space-y-1.5",
              children: [
                s.jsx("span", {
                  className:
                    "text-[11px] font-bold text-slate-700 uppercase tracking-wider",
                  children: "Date",
                }),
                s.jsx("input", {
                  type: "date",
                  value: m,
                  min: Qu(),
                  onChange: (ee) => {
                    (f(ee.target.value), g(null));
                  },
                  className:
                    "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none",
                }),
              ],
            }),
            s.jsxs("label", {
              className: "block space-y-1.5",
              children: [
                s.jsx("span", {
                  className:
                    "text-[11px] font-bold text-slate-700 uppercase tracking-wider",
                  children: "Mode",
                }),
                s.jsxs("select", {
                  value: h,
                  onChange: (ee) => {
                    (j(ee.target.value), g(null));
                  },
                  className:
                    "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none",
                  children: [
                    s.jsx("option", { value: "", children: "Any" }),
                    s.jsx("option", {
                      value: "in_person",
                      children: "In-clinic",
                    }),
                    s.jsx("option", {
                      value: "teleconsult",
                      children: "Video",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        s.jsxs("div", {
          className: "mb-4",
          children: [
            s.jsx("p", {
              className:
                "text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2",
              children: "Available slots",
            }),
            Q
              ? s.jsx(He, { label: "Checking availability..." })
              : D
                ? s.jsx(Ze, { error: D, onRetry: te })
                : Z.length === 0
                  ? s.jsxs("div", {
                      className:
                        "text-center py-6 px-3 bg-slate-50 rounded-xl border border-slate-200",
                      children: [
                        s.jsx(tr, {
                          className: "w-5 h-5 text-slate-300 mx-auto mb-2",
                        }),
                        s.jsx("p", {
                          className: "text-xs text-slate-500",
                          children:
                            "No open slots on this date. This doctor may not have published availability yet.",
                        }),
                      ],
                    })
                  : s.jsx("div", {
                      className: "grid grid-cols-3 gap-2",
                      children: Z.map((ee) => {
                        const G = new Date(ee.start).toLocaleTimeString(
                            "en-IN",
                            { hour: "2-digit", minute: "2-digit", hour12: !0 },
                          ),
                          de = (y == null ? void 0 : y.start) === ee.start;
                        return s.jsx(
                          "button",
                          {
                            onClick: () => g(ee),
                            className: `py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all ${de ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300"}`,
                            children: G,
                          },
                          ee.start,
                        );
                      }),
                    }),
          ],
        }),
        s.jsxs("label", {
          className: "block space-y-1.5 mb-4",
          children: [
            s.jsx("span", {
              className:
                "text-[11px] font-bold text-slate-700 uppercase tracking-wider",
              children: "Reason for visit",
            }),
            s.jsx("textarea", {
              rows: 2,
              value: E,
              onChange: (ee) => N(ee.target.value),
              placeholder: "Chest pain for three days",
              className:
                "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none resize-none",
            }),
            s.jsx("span", {
              className: "block text-[10px] text-slate-400",
              children: "At least 3 characters.",
            }),
          ],
        }),
        R &&
          s.jsx("div", {
            className:
              "rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 mb-3",
            children: s.jsx("p", {
              className: "text-xs font-semibold text-rose-700",
              children: R.message,
            }),
          }),
        s.jsxs("button", {
          onClick: be,
          disabled: !y || E.trim().length < 3 || S,
          className:
            "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl transition-colors",
          children: [
            S
              ? s.jsx(ht, { className: "w-4 h-4 animate-spin" })
              : s.jsx(Mn, { className: "w-4 h-4" }),
            "Confirm booking",
          ],
        }),
      ],
    }),
  });
}
const yh = { All: void 0, "5+ Years": 5, "10+ Years": 10, "15+ Years": 15 };
function wh({ initialSearch: a = "" }) {
  const [u, o] = P.useState(a),
    [m, f] = P.useState(a),
    [h, j] = P.useState("All"),
    [y, g] = P.useState("All"),
    [E, N] = P.useState("All"),
    [S, _] = P.useState(!1),
    [R, $] = P.useState(null),
    [C, D] = P.useState(null);
  P.useEffect(() => {
    const we = setTimeout(() => f(u), 350);
    return () => clearTimeout(we);
  }, [u]);
  const Q = P.useMemo(
      () => ({
        q: m || void 0,
        specialty: y === "All" ? void 0 : y,
        minExperience: yh[E],
        maxFee: h === "Under ₹1200" ? 1200 : void 0,
        mode: h === "Video Consult Available" ? "teleconsult" : void 0,
        sort: h === "Top Rated (4.8+)" ? "rating" : void 0,
        limit: 50,
      }),
      [m, y, E, h],
    ),
    {
      data: te,
      error: le,
      loading: Z,
      reload: be,
    } = $e(() => Mf.search(Q), [Q]),
    ee = P.useMemo(() => (te || []).map(Q0), [te]),
    G = P.useMemo(
      () =>
        ee.filter(
          (we) =>
            !(
              (S && we.status !== "Online") ||
              (h === "Top Rated (4.8+)" && Number(we.rating) < 4.8)
            ),
        ),
      [ee, S, h],
    ),
    de = P.useMemo(() => {
      const we = new Set();
      return (
        ee.forEach(($t) => $t.specialties.forEach((at) => we.add(ue(at)))),
        ["All", ...[...we].sort()]
      );
    }, [ee]),
    Te = () => {
      (o(""), j("All"), g("All"), N("All"), _(!1));
    };
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Find Verified Specialists",
        description:
          "Book video consultations or in-person clinic visits with admin-verified medical specialists.",
        badgeText: `${ee.length} Verified`,
      }),
      s.jsx(mh, {
        searchTerm: u,
        onSearchChange: o,
        activeFilterPill: h,
        onSelectPill: j,
        resultCount: G.length,
      }),
      C &&
        s.jsx("div", {
          className:
            "rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700",
          children: C,
        }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
        children: [
          s.jsx("div", {
            className: "lg:col-span-1",
            children: s.jsx(xh, {
              specialties: de,
              selectedSpecialty: y,
              onSelectSpecialty: g,
              selectedExp: E,
              onSelectExp: N,
              onlyOnline: S,
              onToggleOnline: _,
              onReset: Te,
            }),
          }),
          s.jsx("div", {
            className: "lg:col-span-3",
            children: Z
              ? s.jsx(He, { label: "Searching specialists..." })
              : le
                ? s.jsx(Ze, { error: le, onRetry: be })
                : G.length === 0
                  ? s.jsx(Lt, {
                      title: "No specialists match your criteria",
                      description:
                        "Only doctors an admin has verified appear in search. Try resetting the filters.",
                      action: s.jsx("button", {
                        onClick: Te,
                        className:
                          "text-xs font-bold text-blue-600 hover:underline",
                        children: "Reset filters",
                      }),
                    })
                  : s.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: G.map((we) =>
                        s.jsx(gh, { doctor: we, onBook: $ }, we.id),
                      ),
                    }),
          }),
        ],
      }),
      R &&
        s.jsx(vh, {
          doctor: R,
          onClose: () => $(null),
          onBooked: () => {
            ($(null),
              D(
                `Appointment requested with ${R.name}. Check the Appointments tab.`,
              ),
              setTimeout(() => D(null), 6e3));
          },
        }),
    ],
  });
}
const jh = [
  { id: "All", label: "All Files" },
  { id: "Prescriptions", label: "Prescriptions" },
  { id: "Lab Reports", label: "Lab Reports" },
  { id: "Scans", label: "Scans & X-Rays" },
  { id: "Discharge", label: "Discharge" },
  { id: "Vaccines", label: "Vaccines" },
  { id: "Insurance", label: "Insurance" },
  { id: "Other", label: "Other" },
];
function Nh({ activeCategory: a, onSelectCategory: u, counts: o = {} }) {
  return s.jsx("div", {
    className:
      "flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200",
    children: jh.map(({ id: m, label: f }) => {
      const h = a === m,
        j = o[m] ?? 0;
      return s.jsxs(
        "button",
        {
          onClick: () => u(m),
          className: `flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${h ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`,
          children: [
            s.jsx("span", { children: f }),
            s.jsx("span", {
              className: `px-1.5 py-0.5 rounded-full text-[10px] font-bold ${h ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`,
              children: j,
            }),
          ],
        },
        m,
      );
    }),
  });
}
const bh = {
  "Lab Reports": "bg-purple-50 text-purple-600 border-purple-200",
  Scans: "bg-amber-50 text-amber-600 border-amber-200",
  Prescriptions: "bg-blue-50 text-blue-600 border-blue-200",
  Vaccines: "bg-emerald-50 text-emerald-600 border-emerald-200",
};
function kh({ record: a, onDownload: u, onView: o, onDelete: m }) {
  const f = bh[a.category] || "bg-slate-50 text-slate-600 border-slate-200";
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
    children: [
      s.jsxs("div", {
        className: "flex items-center gap-3.5 min-w-0",
        children: [
          s.jsx("div", {
            className: `w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${f}`,
            children: s.jsx(zd, { className: "w-5 h-5" }),
          }),
          s.jsxs("div", {
            className: "min-w-0",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  s.jsx("h4", {
                    className: "font-bold text-sm text-slate-900 truncate",
                    children: a.title,
                  }),
                  s.jsx("span", {
                    className:
                      "text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600",
                    children: a.category,
                  }),
                ],
              }),
              s.jsxs("div", {
                className:
                  "flex items-center gap-3 text-xs text-slate-500 mt-0.5",
                children: [
                  s.jsxs("span", { children: ["By ", a.doctor] }),
                  s.jsx("span", { children: "•" }),
                  s.jsx("span", { children: a.date }),
                  s.jsx("span", { children: "•" }),
                  s.jsx("span", {
                    className: "text-slate-400",
                    children: a.size,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        className: "flex items-center gap-2 shrink-0 self-end sm:self-auto",
        children: [
          s.jsxs("button", {
            onClick: () => o(a),
            className:
              "p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5",
            title: "Preview document",
            children: [
              s.jsx(d0, { className: "w-3.5 h-3.5" }),
              s.jsx("span", {
                className: "hidden md:inline",
                children: "View",
              }),
            ],
          }),
          s.jsxs("button", {
            onClick: () => u(a),
            className:
              "p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5",
            title: "Download",
            children: [
              s.jsx(c0, { className: "w-3.5 h-3.5" }),
              s.jsx("span", { children: "Download" }),
            ],
          }),
          m &&
            s.jsx("button", {
              onClick: () => m(a),
              className:
                "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors",
              title: "Remove from vault",
              children: s.jsx(vf, { className: "w-3.5 h-3.5" }),
            }),
        ],
      }),
    ],
  });
}
const Ni = 15;
function Sh({ onUpload: a, usedLabel: u = "0 B" }) {
  const o = P.useRef(null),
    [m, f] = P.useState(null),
    [h, j] = P.useState(""),
    [y, g] = P.useState("lab_report"),
    [E, N] = P.useState(!1),
    [S, _] = P.useState(null),
    R = (C) => {
      var Q;
      const D = (Q = C.target.files) == null ? void 0 : Q[0];
      if (D) {
        if (D.size > Ni * 1024 * 1024) {
          _(`That file is larger than the ${Ni} MB limit.`);
          return;
        }
        (_(null), f(D), j((te) => te || D.name.replace(/\.[^/.]+$/, "")));
      }
    },
    $ = async () => {
      if (!(!m || !h.trim())) {
        (N(!0), _(null));
        try {
          (await a({ file: m, title: h.trim(), category: y }),
            f(null),
            j(""),
            o.current && (o.current.value = ""));
        } catch (C) {
          _(C.message);
        } finally {
          N(!1);
        }
      }
    };
  return s.jsxs("div", {
    className: "space-y-4",
    children: [
      s.jsxs("div", {
        className:
          "bg-white rounded-2xl border border-dashed border-blue-300 p-5 shadow-xs space-y-3",
        children: [
          s.jsx("input", {
            ref: o,
            type: "file",
            className: "hidden",
            onChange: R,
            accept: ".pdf,.png,.jpg,.jpeg,.webp",
          }),
          s.jsxs("div", {
            className: "text-center",
            children: [
              s.jsx("div", {
                className:
                  "w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3",
                children: s.jsx(o0, { className: "w-6 h-6" }),
              }),
              s.jsx("h4", {
                className: "text-sm font-bold text-slate-800 mb-1",
                children: "Upload New Document",
              }),
              s.jsxs("p", {
                className: "text-xs text-slate-500",
                children: ["PDF, PNG, JPG up to ", Ni, " MB"],
              }),
            ],
          }),
          s.jsx(St, {
            variant: "outline",
            size: "sm",
            className: "w-full text-xs",
            onClick: () => {
              var C;
              return (C = o.current) == null ? void 0 : C.click();
            },
            children: m ? m.name : "Choose file",
          }),
          m &&
            s.jsxs("div", {
              className: "space-y-2.5 pt-1",
              children: [
                s.jsx("input", {
                  value: h,
                  onChange: (C) => j(C.target.value),
                  placeholder: "Document title",
                  className:
                    "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none",
                }),
                s.jsx("select", {
                  value: y,
                  onChange: (C) => g(C.target.value),
                  className:
                    "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none",
                  children: Y0.map((C) =>
                    s.jsx(
                      "option",
                      { value: C.value, children: C.label },
                      C.value,
                    ),
                  ),
                }),
                s.jsx(St, {
                  variant: "primary",
                  size: "sm",
                  className: "w-full text-xs font-bold",
                  onClick: $,
                  disabled: E || !h.trim(),
                  children: E
                    ? s.jsxs("span", {
                        className: "flex items-center justify-center gap-1.5",
                        children: [
                          s.jsx(ht, { className: "w-3.5 h-3.5 animate-spin" }),
                          " Uploading",
                        ],
                      })
                    : "Upload to vault",
                }),
              ],
            }),
          S &&
            s.jsx("p", {
              className: "text-[11px] text-rose-600 font-medium text-center",
              children: S,
            }),
        ],
      }),
      s.jsxs("div", {
        className:
          "bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3",
        children: [
          s.jsxs("div", {
            className: "flex items-center justify-between text-xs",
            children: [
              s.jsxs("span", {
                className: "font-bold text-slate-700 flex items-center gap-1.5",
                children: [
                  s.jsx(p0, { className: "w-3.5 h-3.5 text-blue-600" }),
                  "Storage used",
                ],
              }),
              s.jsx("span", {
                className: "font-semibold text-slate-500",
                children: u,
              }),
            ],
          }),
          s.jsxs("div", {
            className:
              "flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium",
            children: [
              s.jsx(jl, { className: "w-3.5 h-3.5" }),
              s.jsx("span", {
                children: "Access is logged in the ABDM audit trail",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Ch() {
  const [a, u] = P.useState("All"),
    [o, m] = P.useState(null),
    {
      data: f,
      error: h,
      loading: j,
      reload: y,
    } = $e(() => Vr.mine({ limit: 100 }), []),
    g = P.useMemo(() => (f || []).map(q0), [f]),
    E = g.filter((D) => a === "All" || D.category === a),
    N = g.reduce(
      (D, Q) => (
        (D.All = (D.All || 0) + 1),
        (D[Q.category] = (D[Q.category] || 0) + 1),
        D
      ),
      {},
    ),
    S = (f || []).reduce((D, Q) => D + (Q.sizeBytes || 0), 0),
    _ = async ({ file: D, title: Q, category: te }) => {
      (await Vr.upload({ file: D, title: Q, category: te }),
        m(`"${Q}" uploaded.`),
        setTimeout(() => m(null), 5e3),
        await y());
    },
    R = async (D) => {
      try {
        const Q = await Vr.download(D.id),
          te = URL.createObjectURL(Q),
          le = document.createElement("a");
        ((le.href = te),
          (le.download = D.title),
          document.body.appendChild(le),
          le.click(),
          le.remove(),
          URL.revokeObjectURL(te));
      } catch (Q) {
        alert(Q.message);
      }
    },
    $ = async (D) => {
      try {
        const Q = await Vr.download(D.id);
        window.open(URL.createObjectURL(Q), "_blank", "noopener");
      } catch (Q) {
        alert(Q.message);
      }
    },
    C = async (D) => {
      if (confirm(`Remove "${D.title}" from your vault?`))
        try {
          (await Vr.archive(D.id), await y());
        } catch (Q) {
          alert(Q.message);
        }
    };
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "ABHA Medical Records & Vault",
        description:
          "Encrypted repository of your prescriptions, lab reports, discharge summaries, and vaccine passes.",
        badgeText: `${g.length} Documents`,
      }),
      o &&
        s.jsx("div", {
          className:
            "rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700",
          children: o,
        }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        children: [
          s.jsxs("div", {
            className: "lg:col-span-2 space-y-4",
            children: [
              s.jsx(Nh, { activeCategory: a, onSelectCategory: u, counts: N }),
              s.jsx("div", {
                className: "space-y-3 pt-2",
                children: j
                  ? s.jsx(He, { label: "Opening your vault..." })
                  : h
                    ? s.jsx(Ze, { error: h, onRetry: y })
                    : E.length === 0
                      ? s.jsx(Lt, {
                          title:
                            g.length === 0
                              ? "Your vault is empty"
                              : "Nothing in this category",
                          description:
                            "Upload a prescription, lab report or scan using the panel on the right.",
                        })
                      : E.map((D) =>
                          s.jsx(
                            kh,
                            {
                              record: D,
                              onDownload: R,
                              onView: $,
                              onDelete: C,
                            },
                            D.id,
                          ),
                        ),
              }),
            ],
          }),
          s.jsx("div", {
            children: s.jsx(Sh, { onUpload: _, usedLabel: Tf(S) }),
          }),
        ],
      }),
    ],
  });
}
function _h({ profile: a, onShowQR: u }) {
  const { logout: o } = At();
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6",
    children: [
      s.jsxs("div", {
        className: "text-center",
        children: [
          s.jsxs("div", {
            className: "relative inline-block mb-3",
            children: [
              s.jsx("img", {
                src: a.avatar,
                alt: a.name,
                className:
                  "w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 mx-auto",
              }),
              s.jsx("div", {
                className:
                  "absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-xs",
                children: s.jsx("div", {
                  className:
                    "w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white",
                  title: "Verified",
                  children: s.jsx(Gr, { className: "w-3.5 h-3.5" }),
                }),
              }),
            ],
          }),
          s.jsx("h3", {
            className: "font-bold text-slate-900 text-lg",
            children: a.name,
          }),
          s.jsxs("p", {
            className: "text-xs text-blue-600 font-semibold mb-2",
            children: ["ABHA ID: ", a.id],
          }),
          s.jsx(es, { variant: "confirmed", children: "ABDM Linked & Active" }),
        ],
      }),
      s.jsxs("div", {
        className: "space-y-3 pt-4 border-t border-slate-100 text-xs",
        children: [
          s.jsx(ml, {
            icon: u0,
            iconClass: "text-rose-500",
            label: "Blood Group",
            value: a.bloodGroup,
            bold: !0,
          }),
          s.jsx(ml, {
            icon: w0,
            iconClass: "text-blue-500",
            label: "Email",
            value: a.email,
            truncate: !0,
          }),
          s.jsx(ml, {
            icon: zi,
            iconClass: "text-emerald-500",
            label: "Mobile",
            value: a.phone,
          }),
          s.jsx(ml, {
            icon: Kr,
            iconClass: "text-amber-500",
            label: "Location",
            value: a.city,
          }),
        ],
      }),
      s.jsxs("div", {
        className:
          "p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs space-y-1",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-1.5 font-bold text-rose-700",
            children: [
              s.jsx(h0, { className: "w-3.5 h-3.5" }),
              s.jsx("span", { children: "Known Allergies" }),
            ],
          }),
          s.jsx("p", {
            className: "text-rose-600 text-[11px]",
            children: a.allergies,
          }),
        ],
      }),
      s.jsxs("div", {
        className: "space-y-2",
        children: [
          s.jsxs("button", {
            onClick: u,
            className:
              "w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors",
            children: [
              s.jsx(Jd, { className: "w-4 h-4 text-blue-600" }),
              s.jsx("span", { children: "Display ABDM Health QR" }),
            ],
          }),
          s.jsxs("button", {
            onClick: o,
            className:
              "w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors",
            children: [
              s.jsx(Nl, { className: "w-4 h-4" }),
              s.jsx("span", { children: "Sign out" }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ml({
  icon: a,
  iconClass: u,
  label: o,
  value: m,
  bold: f,
  truncate: h,
}) {
  return s.jsxs("div", {
    className: "flex items-center justify-between py-1",
    children: [
      s.jsxs("span", {
        className: "text-slate-500 flex items-center gap-2",
        children: [s.jsx(a, { className: `w-3.5 h-3.5 ${u}` }), " ", o],
      }),
      s.jsx("span", {
        className: `${f ? "font-bold text-slate-900" : "font-medium text-slate-800"} ${h ? "truncate max-w-[140px]" : ""}`,
        children: m,
      }),
    ],
  });
}
const Eh = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  mt =
    "w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white outline-none transition-all";
function Mh({ profile: a, onSaved: u }) {
  const [o, m] = P.useState("personal"),
    f = (h) => m(o === h ? "" : h);
  return s.jsxs("div", {
    className: "space-y-3",
    children: [
      s.jsx(bi, {
        id: "personal",
        openSection: o,
        onToggle: f,
        icon: T0,
        iconClass: "text-blue-600",
        title: "Personal Identification & ABDM Profile",
        children: s.jsx(zh, { profile: a, onSaved: u }),
      }),
      s.jsx(bi, {
        id: "emergency",
        openSection: o,
        onToggle: f,
        icon: Yd,
        iconClass: "text-rose-600",
        title: "Emergency Contact & SOS Dispatch",
        children: s.jsx(Th, {}),
      }),
      s.jsx(bi, {
        id: "security",
        openSection: o,
        onToggle: f,
        icon: v0,
        iconClass: "text-emerald-600",
        title: "Password & Health Data Privacy",
        children: s.jsx(Ph, {}),
      }),
    ],
  });
}
function bi({
  id: a,
  openSection: u,
  onToggle: o,
  icon: m,
  iconClass: f,
  title: h,
  children: j,
}) {
  const y = u === a;
  return s.jsxs("div", {
    className:
      "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs",
    children: [
      s.jsxs("button", {
        onClick: () => o(a),
        className:
          "w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 text-sm hover:bg-slate-50",
        children: [
          s.jsxs("div", {
            className: "flex items-center gap-2.5",
            children: [
              s.jsx(m, { className: `w-4 h-4 ${f}` }),
              s.jsx("span", { children: h }),
            ],
          }),
          s.jsx(pd, {
            className: `w-4 h-4 text-slate-400 transition-transform ${y ? "rotate-180" : ""}`,
          }),
        ],
      }),
      y &&
        s.jsx("div", {
          className: "p-4 pt-3 border-t border-slate-100 space-y-3",
          children: j,
        }),
    ],
  });
}
function zh({ profile: a, onSaved: u }) {
  const [o, m] = P.useState({
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      district: "",
      state: "",
    }),
    [f, h] = P.useState({ busy: !1, saved: !1, error: null });
  P.useEffect(() => {
    Yr.me()
      .then((g) => {
        var E, N;
        return m({
          name: a.name !== "Your account" ? a.name : "",
          email: a.email !== "Not added" ? a.email : "",
          dateOfBirth:
            g != null && g.dateOfBirth
              ? String(g.dateOfBirth).slice(0, 10)
              : "",
          gender: (g == null ? void 0 : g.gender) || "",
          bloodGroup: (g == null ? void 0 : g.bloodGroup) || "",
          district:
            ((E = g == null ? void 0 : g.address) == null
              ? void 0
              : E.district) || "",
          state:
            ((N = g == null ? void 0 : g.address) == null ? void 0 : N.state) ||
            "",
        });
      })
      .catch(() => {});
  }, [a.name, a.email]);
  const j = (g) => (E) => m((N) => ({ ...N, [g]: E.target.value })),
    y = async () => {
      h({ busy: !0, saved: !1, error: null });
      try {
        const g = await yl.me(),
          E = {};
        (o.name.trim() && o.name.trim() !== g.name && (E.name = o.name.trim()),
          o.email.trim() &&
            o.email.trim() !== g.email &&
            (E.email = o.email.trim()));
        const N = Object.keys(E).length ? await yl.updateMe(E) : g,
          S = {};
        (o.dateOfBirth && (S.dateOfBirth = o.dateOfBirth),
          o.gender && (S.gender = o.gender),
          o.bloodGroup && (S.bloodGroup = o.bloodGroup),
          (o.district || o.state) &&
            (S.address = {
              district: o.district || void 0,
              state: o.state || void 0,
            }),
          Object.keys(S).length && (await Yr.updateMe(S)),
          h({ busy: !1, saved: !0, error: null }),
          setTimeout(() => h((_) => ({ ..._, saved: !1 })), 2500),
          u == null || u(N));
      } catch (g) {
        h({ busy: !1, saved: !1, error: g.message });
      }
    };
  return s.jsxs(s.Fragment, {
    children: [
      s.jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
        children: [
          s.jsx(pt, {
            label: "Full legal name",
            children: s.jsx("input", {
              value: o.name,
              onChange: j("name"),
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "Email",
            children: s.jsx("input", {
              type: "email",
              value: o.email,
              onChange: j("email"),
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "Date of birth",
            children: s.jsx("input", {
              type: "date",
              value: o.dateOfBirth,
              onChange: j("dateOfBirth"),
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "Gender",
            children: s.jsxs("select", {
              value: o.gender,
              onChange: j("gender"),
              className: mt,
              children: [
                s.jsx("option", { value: "", children: "Not set" }),
                s.jsx("option", { value: "male", children: "Male" }),
                s.jsx("option", { value: "female", children: "Female" }),
                s.jsx("option", { value: "other", children: "Other" }),
                s.jsx("option", {
                  value: "undisclosed",
                  children: "Prefer not to say",
                }),
              ],
            }),
          }),
          s.jsx(pt, {
            label: "Blood group",
            children: s.jsxs("select", {
              value: o.bloodGroup,
              onChange: j("bloodGroup"),
              className: mt,
              children: [
                s.jsx("option", { value: "", children: "Not set" }),
                Eh.map((g) => s.jsx("option", { value: g, children: g }, g)),
              ],
            }),
          }),
          s.jsx(pt, {
            label: "District",
            children: s.jsx("input", {
              value: o.district,
              onChange: j("district"),
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "State",
            children: s.jsx("input", {
              value: o.state,
              onChange: j("state"),
              className: mt,
            }),
          }),
        ],
      }),
      s.jsx(Li, { status: f, onSave: y, label: "Save changes" }),
    ],
  });
}
function Th() {
  const [a, u] = P.useState([]),
    [o, m] = P.useState({ name: "", phone: "", relationship: "" }),
    [f, h] = P.useState({ busy: !1, saved: !1, error: null }),
    j = () =>
      Ei.contacts()
        .then(u)
        .catch(() => {});
  P.useEffect(() => {
    j();
  }, []);
  const y = (E) => (N) => m((S) => ({ ...S, [E]: N.target.value })),
    g = async () => {
      h({ busy: !0, saved: !1, error: null });
      try {
        (await Ei.addContact({
          name: o.name.trim(),
          phone: o.phone.trim(),
          relationship: o.relationship.trim(),
          isPrimary: a.length === 0,
        }),
          m({ name: "", phone: "", relationship: "" }),
          h({ busy: !1, saved: !0, error: null }),
          setTimeout(() => h((E) => ({ ...E, saved: !1 })), 2500),
          j());
      } catch (E) {
        h({ busy: !1, saved: !1, error: E.message });
      }
    };
  return s.jsxs(s.Fragment, {
    children: [
      a.length > 0 &&
        s.jsx("ul", {
          className: "space-y-1.5",
          children: a.map((E) =>
            s.jsxs(
              "li",
              {
                className:
                  "flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs",
                children: [
                  s.jsxs("span", {
                    className: "font-semibold text-slate-700",
                    children: [
                      E.name,
                      " ",
                      s.jsxs("span", {
                        className: "text-slate-400 font-normal",
                        children: ["(", E.relationship, ")"],
                      }),
                    ],
                  }),
                  s.jsx("span", {
                    className: "text-slate-500",
                    children: E.phone,
                  }),
                ],
              },
              E._id,
            ),
          ),
        }),
      s.jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
        children: [
          s.jsx(pt, {
            label: "Name",
            children: s.jsx("input", {
              value: o.name,
              onChange: y("name"),
              placeholder: "Sunita Sharma",
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "Phone",
            children: s.jsx("input", {
              value: o.phone,
              onChange: y("phone"),
              placeholder: "+919811122334",
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "Relationship",
            children: s.jsx("input", {
              value: o.relationship,
              onChange: y("relationship"),
              placeholder: "Spouse",
              className: mt,
            }),
          }),
        ],
      }),
      s.jsx(Li, {
        status: f,
        onSave: g,
        label: "Add contact",
        disabled: !o.name.trim() || !o.phone.trim() || !o.relationship.trim(),
      }),
    ],
  });
}
function Ph() {
  const [a, u] = P.useState({ currentPassword: "", newPassword: "" }),
    [o, m] = P.useState({ busy: !1, saved: !1, error: null }),
    f = (j) => (y) => u((g) => ({ ...g, [j]: y.target.value })),
    h = async () => {
      m({ busy: !0, saved: !1, error: null });
      try {
        (await vl.changePassword(a),
          u({ currentPassword: "", newPassword: "" }),
          m({ busy: !1, saved: !0, error: null }));
      } catch (j) {
        m({ busy: !1, saved: !1, error: j.message });
      }
    };
  return s.jsxs(s.Fragment, {
    children: [
      s.jsx("p", {
        className: "text-xs text-slate-600",
        children:
          "Every read of your records is written to the audit trail, visible on the home screen.",
      }),
      s.jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
        children: [
          s.jsx(pt, {
            label: "Current password",
            children: s.jsx("input", {
              type: "password",
              value: a.currentPassword,
              onChange: f("currentPassword"),
              className: mt,
            }),
          }),
          s.jsx(pt, {
            label: "New password",
            children: s.jsx("input", {
              type: "password",
              value: a.newPassword,
              onChange: f("newPassword"),
              className: mt,
            }),
          }),
        ],
      }),
      o.saved &&
        s.jsx("p", {
          className: "text-[11px] text-emerald-600 font-semibold",
          children: "Password updated. You will be asked to sign in again.",
        }),
      s.jsx(Li, {
        status: { ...o, saved: !1 },
        onSave: h,
        label: "Change password",
        disabled: !a.currentPassword || a.newPassword.length < 8,
      }),
    ],
  });
}
function pt({ label: a, children: u }) {
  return s.jsxs("div", {
    children: [
      s.jsx("label", {
        className: "text-xs text-slate-500 font-medium block mb-1",
        children: a,
      }),
      u,
    ],
  });
}
function Li({ status: a, onSave: u, label: o, disabled: m }) {
  return s.jsxs("div", {
    className: "space-y-1.5",
    children: [
      s.jsx(St, {
        size: "sm",
        variant: "primary",
        onClick: u,
        disabled: a.busy || m,
        className: "text-xs",
        children: a.busy
          ? s.jsxs("span", {
              className: "flex items-center gap-1",
              children: [
                s.jsx(ht, { className: "w-3.5 h-3.5 animate-spin" }),
                " Saving",
              ],
            })
          : a.saved
            ? s.jsxs("span", {
                className: "flex items-center gap-1",
                children: [s.jsx(Mn, { className: "w-3.5 h-3.5" }), " Saved"],
              })
            : o,
      }),
      a.error &&
        s.jsx("p", {
          className: "text-[11px] text-rose-600 font-medium",
          children: a.error,
        }),
    ],
  });
}
function Rh() {
  var E;
  const { user: a, setUser: u } = At(),
    [o, m] = P.useState(!1),
    {
      data: f,
      error: h,
      loading: j,
      reload: y,
    } = $e(async () => {
      const [N, S, _] = await Promise.all([
        yl.me(),
        Yr.me().catch(() => null),
        Yr.medicalHistory().catch(() => null),
      ]);
      return { account: N, profile: S, history: _ };
    }, [a == null ? void 0 : a._id]);
  if (j) return s.jsx(He, { label: "Loading your account..." });
  if (h) return s.jsx(Ze, { error: h, onRetry: y });
  const g = J0(f.account, f.profile, f.history);
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Account & ABDM Health ID",
        description:
          "Manage your national health identifier, linked hospitals, emergency contacts, and privacy preferences.",
        badgeText:
          (E = f.account) != null && E.phoneVerified
            ? "Verified Identity"
            : "Unverified",
      }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        children: [
          s.jsx("div", {
            className: "lg:col-span-1",
            children: s.jsx(_h, { profile: g, onShowQR: () => m(!0) }),
          }),
          s.jsx("div", {
            className: "lg:col-span-2",
            children: s.jsx(Mh, {
              profile: g,
              onSaved: async (N) => {
                (u(N), await y());
              },
            }),
          }),
        ],
      }),
      o &&
        s.jsx("div", {
          className:
            "fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4",
          children: s.jsxs("div", {
            className:
              "bg-white rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl border border-slate-100",
            children: [
              s.jsx("button", {
                onClick: () => m(!1),
                className:
                  "absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400",
                children: s.jsx(Jr, { className: "w-5 h-5" }),
              }),
              s.jsx("div", {
                className:
                  "w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3",
                children: s.jsx(Jd, { className: "w-9 h-9" }),
              }),
              s.jsx("h3", {
                className: "font-bold text-slate-900 text-lg",
                children: "National ABDM QR Code",
              }),
              s.jsx("p", {
                className: "text-xs text-slate-500 mb-4",
                children:
                  "Scan at any registered clinic for instant OPD token generation.",
              }),
              s.jsx("div", {
                className:
                  "p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block mb-3",
                children: s.jsx("img", {
                  src: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ABHA:${g.id}`,
                  alt: "ABHA QR",
                  className: "w-40 h-40 mx-auto",
                }),
              }),
              s.jsxs("p", {
                className: "text-xs font-mono font-bold text-slate-700",
                children: ["ABHA: ", g.id],
              }),
            ],
          }),
        }),
    ],
  });
}
const Ah = { name: "", phone: "", email: "", password: "" },
  Dh = (a) => (a.includes("@") ? { email: a.toLowerCase() } : { phone: a });
function Lh() {
  var R;
  const { login: a, register: u } = At(),
    [o, m] = P.useState("login"),
    [f, h] = P.useState(Ah),
    [j, y] = P.useState(null),
    [g, E] = P.useState(!1),
    N = o === "register",
    S = ($) => (C) => h((D) => ({ ...D, [$]: C.target.value })),
    _ = async ($) => {
      ($.preventDefault(), y(null), E(!0));
      try {
        if (N)
          await u({
            name: f.name.trim(),
            phone: f.phone.trim(),
            password: f.password,
            role: "patient",
            ...(f.email.trim() ? { email: f.email.trim() } : {}),
          });
        else {
          const C = await a({ ...Dh(f.phone.trim()), password: f.password });
          ["patient", "admin", "doctor"].includes(C.role) ||
            y({
              message: `That is a ${C.role} account. Swasthya Setu is the patient app - sign in with a patient account.`,
            });
        }
      } catch (C) {
        y(C);
      } finally {
        E(!1);
      }
    };
  return s.jsx("div", {
    className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4",
    children: s.jsxs("div", {
      className: "w-full max-w-sm",
      children: [
        s.jsxs("div", {
          className: "text-center mb-6",
          children: [
            s.jsx("div", {
              className:
                "w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3",
              children: s.jsx(Ad, { className: "w-6 h-6" }),
            }),
            s.jsx("h1", {
              className: "text-xl font-black text-slate-900 tracking-tight",
              children: "Swasthya Setu",
            }),
            s.jsx("p", {
              className: "text-xs text-slate-500 mt-1",
              children: N
                ? "Create your patient health account"
                : "Sign in to your health account",
            }),
          ],
        }),
        s.jsxs("form", {
          onSubmit: _,
          className:
            "bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4",
          children: [
            N &&
              s.jsx(hl, {
                label: "Full name",
                children: s.jsx("input", {
                  required: !0,
                  minLength: 2,
                  value: f.name,
                  onChange: S("name"),
                  placeholder: "Ridhi Saxena",
                  className: pl,
                }),
              }),
            s.jsx(hl, {
              label: N ? "Mobile number" : "Mobile number or email",
              hint: N
                ? "Include the country code, e.g. +919876543210"
                : "Either works - whichever you registered with",
              children: s.jsx("input", {
                required: !0,
                value: f.phone,
                onChange: S("phone"),
                placeholder: N
                  ? "+919876543210"
                  : "+919876543210 or you@example.com",
                className: pl,
              }),
            }),
            N &&
              s.jsx(hl, {
                label: "Email",
                hint: "Optional",
                children: s.jsx("input", {
                  type: "email",
                  value: f.email,
                  onChange: S("email"),
                  placeholder: "you@example.com",
                  className: pl,
                }),
              }),
            s.jsx(hl, {
              label: "Password",
              hint: N
                ? "At least 8 characters, with a letter and a digit"
                : void 0,
              children: s.jsx("input", {
                required: !0,
                type: "password",
                minLength: 8,
                value: f.password,
                onChange: S("password"),
                placeholder: "••••••••",
                className: pl,
              }),
            }),
            j &&
              s.jsxs("div", {
                className:
                  "rounded-xl bg-rose-50 border border-rose-200 px-3 py-2",
                children: [
                  s.jsx("p", {
                    className: "text-xs font-semibold text-rose-700",
                    children: j.message,
                  }),
                  ((R = j.fieldMessages) == null ? void 0 : R.length) > 0 &&
                    s.jsx("ul", {
                      className: "text-[11px] text-rose-600 mt-1 space-y-0.5",
                      children: j.fieldMessages.map(($) =>
                        s.jsx("li", { children: $ }, $),
                      ),
                    }),
                ],
              }),
            s.jsxs("button", {
              type: "submit",
              disabled: g,
              className:
                "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold py-2.5 rounded-xl transition-colors",
              children: [
                g
                  ? s.jsx(ht, { className: "w-4 h-4 animate-spin" })
                  : N
                    ? s.jsx(M0, { className: "w-4 h-4" })
                    : s.jsx(y0, { className: "w-4 h-4" }),
                N ? "Create account" : "Sign in",
              ],
            }),
            s.jsx("button", {
              type: "button",
              onClick: () => {
                (m(N ? "login" : "register"), y(null));
              },
              className:
                "w-full text-xs text-slate-500 hover:text-blue-600 font-medium",
              children: N
                ? "Already registered? Sign in"
                : "New here? Create an account",
            }),
          ],
        }),
      ],
    }),
  });
}
const pl =
  "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all";
function hl({ label: a, hint: u, children: o }) {
  return s.jsxs("label", {
    className: "block space-y-1.5",
    children: [
      s.jsx("span", {
        className:
          "text-[11px] font-bold text-slate-700 uppercase tracking-wider",
        children: a,
      }),
      o,
      u &&
        s.jsx("span", {
          className: "block text-[10px] text-slate-400",
          children: u,
        }),
    ],
  });
}
const $h = {
  doctor: "doctor",
  asha: "ASHA worker",
  hospital: "hospital",
  responder: "emergency responder",
  admin: "platform admin",
};
function Oh({ role: a }) {
  const { logout: u, user: o } = At(),
    m = $h[a] || a;
  return s.jsx("div", {
    className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4",
    children: s.jsxs("div", {
      className:
        "bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-sm w-full text-center space-y-4",
      children: [
        s.jsx("div", {
          className:
            "w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto",
          children: s.jsx(of, { className: "w-6 h-6" }),
        }),
        s.jsxs("div", {
          children: [
            s.jsx("h2", {
              className: "text-base font-bold text-slate-900",
              children: "Wrong account type",
            }),
            s.jsxs("p", {
              className: "text-xs text-slate-500 mt-1.5",
              children: [
                "You are signed in as ",
                s.jsx("strong", {
                  className: "text-slate-700",
                  children: o == null ? void 0 : o.name,
                }),
                ", a ",
                m,
                " ",
                "account. Swasthya Setu is the patient app, so these screens have no data to show you.",
              ],
            }),
          ],
        }),
        s.jsx("div", {
          className:
            "rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-left",
          children: s.jsx("p", {
            className: "text-[11px] text-slate-500",
            children:
              "Sign in with a patient account instead, or register a new one on the login screen.",
          }),
        }),
        s.jsxs("button", {
          onClick: u,
          className:
            "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors",
          children: [s.jsx(Nl, { className: "w-4 h-4" }), "Sign out"],
        }),
      ],
    }),
  });
}
function Fh({ onNavigate: a }) {
  var E, N, S, _, R, $, C, D, Q, te, le, Z, be, ee;
  const {
    data: u,
    error: o,
    loading: m,
    reload: f,
  } = $e(() => nr.dashboard(), []);
  if (m) return s.jsx(He, { label: "Loading platform metrics..." });
  if (o) return s.jsx(Ze, { error: o, onRetry: f });
  const h = (((E = u.verification) == null ? void 0 : E.pending) || []).reduce(
      (G, de) => G + de.count,
      0,
    ),
    j = (((N = u.users) == null ? void 0 : N.byRoleAndStatus) || []).reduce(
      (G, de) => G + de.count,
      0,
    ),
    y = [
      {
        label: "Pending reviews",
        value: h,
        change: "Awaiting you",
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: jd,
      },
      {
        label: "Total users",
        value: j,
        change: `+${((S = u.users) == null ? void 0 : S.newLast24h) ?? 0} in 24h`,
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Ci,
      },
      {
        label: "Appointments",
        value: ((_ = u.activity) == null ? void 0 : _.appointmentsLast7d) ?? 0,
        change: "Last 7 days",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: tr,
      },
      {
        label: "Open emergencies",
        value: ((R = u.emergency) == null ? void 0 : R.open) ?? 0,
        change: `${(($ = u.emergency) == null ? void 0 : $.last7d) ?? 0} in 7 days`,
        color: "text-rose-600",
        bg: "bg-rose-50",
        icon: df,
      },
    ],
    g = Object.values(
      (((C = u.users) == null ? void 0 : C.byRoleAndStatus) || []).reduce(
        (G, de) => {
          const { role: Te, status: we } = de._id;
          return (
            (G[Te] = G[Te] || { role: Te, total: 0, active: 0, pending: 0 }),
            (G[Te].total += de.count),
            we === "active" && (G[Te].active += de.count),
            we === "pending" && (G[Te].pending += de.count),
            G
          );
        },
        {},
      ),
    ).sort((G, de) => de.total - G.total);
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Platform Overview",
        description:
          "Account mix, verification backlog, clinical activity and access-control health across MedLink360.",
        badgeText: "Admin",
      }),
      s.jsx("div", {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        children: y.map((G) => s.jsx(Di, { ...G }, G.label)),
      }),
      h > 0 &&
        s.jsxs("button", {
          onClick: () => a("verifications"),
          className:
            "w-full flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100/70 transition-colors text-left",
          children: [
            s.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                s.jsx("div", {
                  className:
                    "w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0",
                  children: s.jsx(wf, { className: "w-5 h-5" }),
                }),
                s.jsxs("div", {
                  children: [
                    s.jsxs("p", {
                      className: "text-sm font-bold text-amber-900",
                      children: [
                        h,
                        " account",
                        h === 1 ? "" : "s",
                        " waiting for review",
                      ],
                    }),
                    s.jsx("p", {
                      className: "text-xs text-amber-700",
                      children: (
                        ((D = u.verification) == null ? void 0 : D.pending) ||
                        []
                      )
                        .filter((G) => G.count > 0)
                        .map((G) => `${G.count} ${G.role}`)
                        .join(", "),
                    }),
                  ],
                }),
              ],
            }),
            s.jsx("span", {
              className: "text-xs font-bold text-amber-800 shrink-0",
              children: "Review now →",
            }),
          ],
        }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        children: [
          s.jsx(Yu, {
            title: "Accounts by role",
            icon: Ci,
            children: s.jsxs("table", {
              className: "w-full text-xs",
              children: [
                s.jsx("thead", {
                  children: s.jsxs("tr", {
                    className:
                      "text-left text-slate-400 border-b border-slate-100",
                    children: [
                      s.jsx("th", {
                        className: "pb-2 font-semibold",
                        children: "Role",
                      }),
                      s.jsx("th", {
                        className: "pb-2 font-semibold text-right",
                        children: "Active",
                      }),
                      s.jsx("th", {
                        className: "pb-2 font-semibold text-right",
                        children: "Pending",
                      }),
                      s.jsx("th", {
                        className: "pb-2 font-semibold text-right",
                        children: "Total",
                      }),
                    ],
                  }),
                }),
                s.jsx("tbody", {
                  children: g.map((G) =>
                    s.jsxs(
                      "tr",
                      {
                        className: "border-b border-slate-50 last:border-0",
                        children: [
                          s.jsx("td", {
                            className: "py-2 font-semibold text-slate-700",
                            children: ue(G.role),
                          }),
                          s.jsx("td", {
                            className:
                              "py-2 text-right text-emerald-600 font-semibold",
                            children: G.active,
                          }),
                          s.jsx("td", {
                            className:
                              "py-2 text-right text-amber-600 font-semibold",
                            children: G.pending,
                          }),
                          s.jsx("td", {
                            className:
                              "py-2 text-right text-slate-900 font-bold",
                            children: G.total,
                          }),
                        ],
                      },
                      G.role,
                    ),
                  ),
                }),
              ],
            }),
          }),
          s.jsx(Yu, {
            title: "Privacy & access control",
            icon: Gr,
            children: s.jsxs("dl", {
              className: "space-y-2.5 text-xs",
              children: [
                s.jsx(Hr, {
                  label: "Active consents",
                  value:
                    ((Q = u.privacy) == null ? void 0 : Q.activeConsents) ?? 0,
                }),
                s.jsx(Hr, {
                  label: "ASHA assignments expiring in 14 days",
                  value:
                    ((te = u.privacy) == null
                      ? void 0
                      : te.ashaAssignmentsExpiringIn14Days) ?? 0,
                }),
                s.jsx(Hr, {
                  label: "Access denials (7 days)",
                  value:
                    ((le = u.privacy) == null
                      ? void 0
                      : le.accessDenialsLast7d) ?? 0,
                  warn:
                    (((Z = u.privacy) == null
                      ? void 0
                      : Z.accessDenialsLast7d) ?? 0) > 0,
                }),
                s.jsx(Hr, {
                  label: "Consultations (7 days)",
                  value:
                    ((be = u.activity) == null
                      ? void 0
                      : be.consultationsLast7d) ?? 0,
                }),
                s.jsx(Hr, {
                  label: "Verified medicines",
                  value:
                    ((ee = u.catalogue) == null
                      ? void 0
                      : ee.verifiedMedicines) ?? 0,
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function Yu({ title: a, icon: u, children: o }) {
  return s.jsxs("div", {
    className: "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs",
    children: [
      s.jsxs("div", {
        className:
          "flex items-center gap-2 pb-3 mb-3 border-b border-slate-100",
        children: [
          s.jsx(u, { className: "w-4 h-4 text-blue-600" }),
          s.jsx("h3", {
            className: "text-sm font-bold text-slate-900",
            children: a,
          }),
        ],
      }),
      o,
    ],
  });
}
function Hr({ label: a, value: u, warn: o }) {
  return s.jsxs("div", {
    className: "flex items-center justify-between",
    children: [
      s.jsx("dt", { className: "text-slate-500", children: a }),
      s.jsx("dd", {
        className: `font-bold ${o ? "text-rose-600" : "text-slate-900"}`,
        children: u,
      }),
    ],
  });
}
const Ih = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ],
  Bh = [
    { value: "", label: "All roles" },
    { value: "doctor", label: "Doctors" },
    { value: "asha", label: "ASHA workers" },
    { value: "hospital", label: "Hospitals" },
    { value: "responder", label: "Responders" },
  ];
function Uh() {
  const [a, u] = P.useState("pending"),
    [o, m] = P.useState(""),
    [f, h] = P.useState(null),
    [j, y] = P.useState(null),
    {
      data: g,
      error: E,
      loading: N,
      reload: S,
    } = $e(
      () => nr.verifications({ status: a, role: o || void 0, limit: 100 }),
      [a, o],
    ),
    _ = ((g == null ? void 0 : g.groups) || []).filter(
      (C) => C.items.length > 0,
    ),
    R = _.reduce((C, D) => C + D.items.length, 0),
    $ = async (C, D, Q) => {
      var Z;
      const te = ((Z = C.user) == null ? void 0 : Z.name) || "this account";
      let le;
      if (Q === "rejected") {
        if (((le = prompt(`Why is ${te} being rejected?`)), le === null))
          return;
      } else if (
        !confirm(
          `Verify ${te}? They will be able to accept patients immediately.`,
        )
      )
        return;
      h(C._id);
      try {
        (await nr.verify(C.user._id, D, Q, le || void 0),
          y(`${te} ${Q}.`),
          setTimeout(() => y(null), 4e3),
          await S());
      } catch (be) {
        alert(be.message);
      } finally {
        h(null);
      }
    };
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Verification Queue",
        description:
          "Approve or reject doctor, ASHA, hospital and responder accounts. Only verified staff are discoverable by patients.",
        badgeText: `${R} ${ue(a)}`,
      }),
      s.jsxs("div", {
        className: "flex flex-wrap items-center gap-2",
        children: [
          Ih.map((C) =>
            s.jsx(
              "button",
              {
                onClick: () => u(C.value),
                className: `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${a === C.value ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                children: C.label,
              },
              C.value,
            ),
          ),
          s.jsx("span", { className: "w-px h-5 bg-slate-200 mx-1" }),
          s.jsx("select", {
            value: o,
            onChange: (C) => m(C.target.value),
            className:
              "px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-400",
            children: Bh.map((C) =>
              s.jsx("option", { value: C.value, children: C.label }, C.value),
            ),
          }),
        ],
      }),
      j &&
        s.jsx("div", {
          className:
            "rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700",
          children: j,
        }),
      N
        ? s.jsx(He, { label: "Loading queue..." })
        : E
          ? s.jsx(Ze, { error: E, onRetry: S })
          : _.length === 0
            ? s.jsx(Lt, {
                icon: e0,
                title: `Nothing ${a}`,
                description:
                  a === "pending"
                    ? "Every staff account has been reviewed. New registrations land here automatically."
                    : `No accounts currently have the ${a} status.`,
              })
            : _.map((C) =>
                s.jsxs(
                  "div",
                  {
                    className: "space-y-3",
                    children: [
                      s.jsxs("h3", {
                        className:
                          "text-sm font-bold text-slate-900 flex items-center gap-2",
                        children: [
                          ue(C.role),
                          s.jsx("span", {
                            className:
                              "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500",
                            children: C.items.length,
                          }),
                        ],
                      }),
                      s.jsx("div", {
                        className: "space-y-3",
                        children: C.items.map((D) =>
                          s.jsx(
                            Vh,
                            {
                              profile: D,
                              role: C.role,
                              status: a,
                              busy: f === D._id,
                              onDecide: $,
                            },
                            D._id,
                          ),
                        ),
                      }),
                    ],
                  },
                  C.role,
                ),
              ),
    ],
  });
}
function Vh({ profile: a, role: u, status: o, busy: m, onDecide: f }) {
  var g;
  const h = a.user || {},
    j = h.name || "Unnamed account",
    y = [
      a.registrationNumber && ["Registration", a.registrationNumber],
      ((g = a.specialties) == null ? void 0 : g.length) && [
        "Specialties",
        a.specialties.join(", "),
      ],
      a.experienceYears !== void 0 && [
        "Experience",
        `${a.experienceYears} years`,
      ],
      a.consultationFee !== void 0 && ["Fee", `₹${a.consultationFee}`],
      a.ashaId && ["ASHA ID", a.ashaId],
      a.district && ["District", a.district],
      a.type && ["Type", ue(a.type)],
      a.responderType && ["Responder", ue(a.responderType)],
      h.createdAt && ["Registered", Zr(h.createdAt)],
    ].filter(Boolean);
  return s.jsxs("div", {
    className: `bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${m ? "opacity-50 pointer-events-none" : ""}`,
    children: [
      s.jsxs("div", {
        className: "flex items-start gap-4 min-w-0",
        children: [
          s.jsx("img", {
            src: Dt(j),
            alt: j,
            className: "w-12 h-12 rounded-2xl shrink-0",
          }),
          s.jsxs("div", {
            className: "min-w-0 space-y-1.5",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2 flex-wrap",
                children: [
                  s.jsx("h4", {
                    className: "font-bold text-slate-900 text-sm",
                    children: j,
                  }),
                  s.jsx("span", {
                    className:
                      "text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700",
                    children: ue(u),
                  }),
                ],
              }),
              s.jsxs("div", {
                className: "flex items-center gap-3 text-xs text-slate-500",
                children: [
                  s.jsxs("span", {
                    className: "flex items-center gap-1",
                    children: [
                      s.jsx(zi, { className: "w-3 h-3" }),
                      h.phone || "--",
                    ],
                  }),
                  h.email &&
                    s.jsx("span", { className: "truncate", children: h.email }),
                ],
              }),
              s.jsx("dl", {
                className:
                  "flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5",
                children: y.map(([E, N]) =>
                  s.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-1",
                      children: [
                        s.jsxs("dt", {
                          className: "font-semibold text-slate-400",
                          children: [E, ":"],
                        }),
                        s.jsx("dd", {
                          className: "text-slate-700",
                          children: N,
                        }),
                      ],
                    },
                    E,
                  ),
                ),
              }),
              a.rejectionReason &&
                o === "rejected" &&
                s.jsxs("p", {
                  className:
                    "text-[11px] text-rose-600 flex items-center gap-1",
                  children: [
                    s.jsx(of, { className: "w-3 h-3" }),
                    a.rejectionReason,
                  ],
                }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        className: "flex items-center gap-2 shrink-0 self-end lg:self-auto",
        children: [
          m && s.jsx(ht, { className: "w-4 h-4 animate-spin text-blue-600" }),
          o !== "verified" &&
            s.jsxs("button", {
              onClick: () => f(a, u, "verified"),
              className:
                "flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors",
              children: [s.jsx(Mn, { className: "w-3.5 h-3.5" }), "Verify"],
            }),
          o !== "rejected" &&
            s.jsxs("button", {
              onClick: () => f(a, u, "rejected"),
              className:
                "flex items-center gap-1.5 px-3 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors",
              children: [s.jsx(Jr, { className: "w-3.5 h-3.5" }), "Reject"],
            }),
        ],
      }),
    ],
  });
}
const Hh = ["", "patient", "doctor", "asha", "hospital", "responder", "admin"],
  qu = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
    deactivated: "bg-slate-100 text-slate-500 border-slate-200",
  };
function Wh() {
  const { user: a } = At(),
    [u, o] = P.useState(""),
    [m, f] = P.useState(""),
    [h, j] = P.useState(""),
    [y, g] = P.useState(null);
  P.useEffect(() => {
    const C = setTimeout(() => f(u), 350);
    return () => clearTimeout(C);
  }, [u]);
  const {
      data: E,
      error: N,
      loading: S,
      reload: _,
    } = $e(
      () => nr.users({ q: m || void 0, role: h || void 0, limit: 100 }),
      [m, h],
    ),
    R = E || [],
    $ = async (C, D) => {
      const Q = D === "suspended" ? "Suspend" : "Reactivate";
      let te;
      if (D === "suspended") {
        if (
          ((te = prompt(
            `Why is ${C.name} being suspended? (Their sessions end immediately.)`,
          )),
          te === null)
        )
          return;
      } else if (!confirm(`${Q} ${C.name}?`)) return;
      g(C._id);
      try {
        (await nr.setUserStatus(C._id, D, te || void 0), await _());
      } catch (le) {
        alert(le.message);
      } finally {
        g(null);
      }
    };
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "User Directory",
        description:
          "Every account on the platform. Suspending an account revokes its sessions immediately.",
        badgeText: `${R.length} Shown`,
      }),
      s.jsxs("div", {
        className:
          "bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3",
        children: [
          s.jsxs("div", {
            className: "relative flex-1",
            children: [
              s.jsx(Ti, {
                className:
                  "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none",
              }),
              s.jsx("input", {
                value: u,
                onChange: (C) => o(C.target.value),
                placeholder: "Search by name, phone or email...",
                className:
                  "w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white",
              }),
            ],
          }),
          s.jsx("select", {
            value: h,
            onChange: (C) => j(C.target.value),
            className:
              "px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-400",
            children: Hh.map((C) =>
              s.jsx(
                "option",
                { value: C, children: C ? ue(C) : "All roles" },
                C,
              ),
            ),
          }),
        ],
      }),
      S
        ? s.jsx(He, { label: "Loading users..." })
        : N
          ? s.jsx(Ze, { error: N, onRetry: _ })
          : R.length === 0
            ? s.jsx(Lt, {
                title: "No users match",
                description: "Try a different search term or role filter.",
              })
            : s.jsx("div", {
                className:
                  "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden",
                children: R.map((C) =>
                  s.jsxs(
                    "div",
                    {
                      className: `flex items-center justify-between gap-4 p-4 border-b border-slate-50 last:border-0 ${y === C._id ? "opacity-50 pointer-events-none" : ""}`,
                      children: [
                        s.jsxs("div", {
                          className: "flex items-center gap-3 min-w-0",
                          children: [
                            s.jsx("img", {
                              src: Dt(C.name),
                              alt: C.name,
                              className: "w-9 h-9 rounded-xl shrink-0",
                            }),
                            s.jsxs("div", {
                              className: "min-w-0",
                              children: [
                                s.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    s.jsx("p", {
                                      className:
                                        "text-xs font-bold text-slate-900 truncate",
                                      children: C.name,
                                    }),
                                    s.jsx("span", {
                                      className:
                                        "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600",
                                      children: ue(C.role),
                                    }),
                                    C._id === (a == null ? void 0 : a._id) &&
                                      s.jsx("span", {
                                        className:
                                          "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600",
                                        children: "You",
                                      }),
                                  ],
                                }),
                                s.jsxs("p", {
                                  className:
                                    "text-[11px] text-slate-500 truncate",
                                  children: [
                                    C.phone,
                                    C.email ? ` • ${C.email}` : "",
                                    " • joined ",
                                    Zr(C.createdAt),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        s.jsxs("div", {
                          className: "flex items-center gap-2 shrink-0",
                          children: [
                            s.jsx("span", {
                              className: `text-[10px] font-bold px-2 py-1 rounded-lg border ${qu[C.status] || qu.deactivated}`,
                              children: ue(C.status),
                            }),
                            y === C._id &&
                              s.jsx(ht, {
                                className:
                                  "w-3.5 h-3.5 animate-spin text-blue-600",
                              }),
                            C._id !== (a == null ? void 0 : a._id) &&
                              (C.status === "suspended"
                                ? s.jsx("button", {
                                    onClick: () => $(C, "active"),
                                    className:
                                      "p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors",
                                    title: "Reactivate",
                                    children: s.jsx(jl, {
                                      className: "w-4 h-4",
                                    }),
                                  })
                                : s.jsx("button", {
                                    onClick: () => $(C, "suspended"),
                                    className:
                                      "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
                                    title: "Suspend",
                                    children: s.jsx(t0, {
                                      className: "w-4 h-4",
                                    }),
                                  })),
                          ],
                        }),
                      ],
                    },
                    C._id,
                  ),
                ),
              }),
    ],
  });
}
const Qh = ["", "success", "denied", "failure"],
  Yh = {
    success: "bg-emerald-50 text-emerald-700",
    denied: "bg-amber-50 text-amber-700",
    failure: "bg-rose-50 text-rose-700",
  };
function qh() {
  const [a, u] = P.useState(""),
    {
      data: o,
      error: m,
      loading: f,
      reload: h,
    } = $e(() => nr.auditLogs({ outcome: a || void 0, limit: 100 }), [a]),
    j = o || [];
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Platform Audit Log",
        description:
          "Every read, write and denied access across all patients, with the actor who performed it.",
        badgeText: `${j.length} Entries`,
      }),
      s.jsx("div", {
        className: "flex items-center gap-2",
        children: Qh.map((y) =>
          s.jsx(
            "button",
            {
              onClick: () => u(y),
              className: `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${a === y ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: y ? ue(y) : "All",
            },
            y || "all",
          ),
        ),
      }),
      f
        ? s.jsx(He, { label: "Loading audit trail..." })
        : m
          ? s.jsx(Ze, { error: m, onRetry: h })
          : j.length === 0
            ? s.jsx(Lt, {
                icon: rf,
                title: "No entries",
                description: "Nothing matches this filter.",
              })
            : s.jsx("div", {
                className:
                  "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto",
                children: s.jsxs("table", {
                  className: "w-full text-xs min-w-[640px]",
                  children: [
                    s.jsx("thead", {
                      children: s.jsxs("tr", {
                        className:
                          "text-left text-slate-400 border-b border-slate-100",
                        children: [
                          s.jsx("th", {
                            className: "p-3 font-semibold",
                            children: "Actor",
                          }),
                          s.jsx("th", {
                            className: "p-3 font-semibold",
                            children: "Action",
                          }),
                          s.jsx("th", {
                            className: "p-3 font-semibold",
                            children: "Resource",
                          }),
                          s.jsx("th", {
                            className: "p-3 font-semibold",
                            children: "Outcome",
                          }),
                          s.jsx("th", {
                            className: "p-3 font-semibold text-right",
                            children: "When",
                          }),
                        ],
                      }),
                    }),
                    s.jsx("tbody", {
                      children: j.map((y) => {
                        var g;
                        return s.jsxs(
                          "tr",
                          {
                            className: "border-b border-slate-50 last:border-0",
                            children: [
                              s.jsxs("td", {
                                className: "p-3",
                                children: [
                                  s.jsx("span", {
                                    className: "font-semibold text-slate-800",
                                    children:
                                      ((g = y.actor) == null
                                        ? void 0
                                        : g.name) || "System",
                                  }),
                                  y.actorRole &&
                                    s.jsxs("span", {
                                      className: "text-slate-400",
                                      children: [" · ", ue(y.actorRole)],
                                    }),
                                ],
                              }),
                              s.jsx("td", {
                                className: "p-3 text-slate-700",
                                children: ue(y.action),
                              }),
                              s.jsx("td", {
                                className: "p-3 text-slate-500",
                                children: ue(y.resourceType),
                              }),
                              s.jsxs("td", {
                                className: "p-3",
                                children: [
                                  s.jsx("span", {
                                    className: `text-[10px] font-bold px-2 py-0.5 rounded ${Yh[y.outcome] || "bg-slate-100 text-slate-600"}`,
                                    children: ue(y.outcome),
                                  }),
                                  y.reason &&
                                    s.jsx("span", {
                                      className:
                                        "text-[10px] text-slate-400 ml-1.5",
                                      children: y.reason,
                                    }),
                                ],
                              }),
                              s.jsx("td", {
                                className: "p-3 text-right text-slate-400",
                                children: Ai(y.createdAt),
                              }),
                            ],
                          },
                          y._id,
                        );
                      }),
                    }),
                  ],
                }),
              }),
    ],
  });
}
const Kh = [
  { id: "dashboard", label: "Overview", icon: Fd },
  { id: "verifications", label: "Verifications", icon: jd },
  { id: "users", label: "Users", icon: Ci },
  { id: "audit", label: "Audit log", icon: rf },
];
function Gh() {
  const { user: a, logout: u } = At(),
    [o, m] = P.useState("dashboard"),
    f = () => {
      switch (o) {
        case "verifications":
          return s.jsx(Uh, {});
        case "users":
          return s.jsx(Wh, {});
        case "audit":
          return s.jsx(qh, {});
        default:
          return s.jsx(Fh, { onNavigate: m });
      }
    };
  return s.jsxs("div", {
    className: "flex min-h-screen bg-[#F8FAFC]",
    children: [
      s.jsxs("aside", {
        className:
          "w-60 bg-white border-r border-slate-200 flex flex-col shrink-0",
        children: [
          s.jsxs("div", {
            className:
              "h-16 flex items-center gap-2.5 px-5 border-b border-slate-200",
            children: [
              s.jsx("div", {
                className:
                  "w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black",
                children: "MS",
              }),
              s.jsxs("div", {
                className: "leading-none",
                children: [
                  s.jsx("p", {
                    className:
                      "text-sm font-black text-slate-900 tracking-tight",
                    children: "MedLink360",
                  }),
                  s.jsx("span", {
                    className: "text-[10px] font-semibold text-slate-400",
                    children: "Admin console",
                  }),
                ],
              }),
            ],
          }),
          s.jsx("nav", {
            className: "flex-1 p-3 space-y-1",
            children: Kh.map(({ id: h, label: j, icon: y }) =>
              s.jsxs(
                "button",
                {
                  onClick: () => m(h),
                  className: `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${o === h ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`,
                  children: [
                    s.jsx(y, { className: "w-4 h-4" }),
                    s.jsx("span", { children: j }),
                  ],
                },
                h,
              ),
            ),
          }),
          s.jsxs("div", {
            className: "p-3 border-t border-slate-200 space-y-2",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2.5 px-2",
                children: [
                  s.jsx("img", {
                    src: Dt((a == null ? void 0 : a.name) || "Admin"),
                    alt: "",
                    className: "w-8 h-8 rounded-full",
                  }),
                  s.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      s.jsx("p", {
                        className: "text-xs font-bold text-slate-800 truncate",
                        children: a == null ? void 0 : a.name,
                      }),
                      s.jsx("span", {
                        className: "text-[10px] text-slate-400",
                        children: a == null ? void 0 : a.phone,
                      }),
                    ],
                  }),
                ],
              }),
              s.jsxs("button", {
                onClick: u,
                className:
                  "w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl transition-colors",
                children: [s.jsx(Nl, { className: "w-3.5 h-3.5" }), "Sign out"],
              }),
            ],
          }),
        ],
      }),
      s.jsx("main", {
        className:
          "flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn min-w-0",
        children: f(),
      }),
    ],
  });
}
function Xh({ onNavigate: a }) {
  var g, E;
  const {
    data: u,
    error: o,
    loading: m,
    reload: f,
  } = $e(() => En.dashboard(), []);
  if (m) return s.jsx(He, { label: "Loading your clinic..." });
  if (o) return s.jsx(Ze, { error: o, onRetry: f });
  const h = u.today || {},
    j = [
      {
        label: "Today",
        value: h.total ?? 0,
        change: `${h.completed ?? 0} completed`,
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: tr,
      },
      {
        label: "Awaiting approval",
        value: u.pendingRequests ?? 0,
        change: "Patient requests",
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: Si,
      },
      {
        label: "Upcoming",
        value: u.upcomingCount ?? 0,
        change: "After today",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: r0,
      },
      {
        label: "Consultations",
        value: u.consultationsThisWeek ?? 0,
        change: "Last 7 days",
        color: "text-purple-600",
        bg: "bg-purple-50",
        icon: Xr,
      },
    ],
    y = u.profile || {};
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Clinic Overview",
        description:
          "Today's schedule, requests waiting on you, and your verification status.",
        badgeText: ue(y.verificationStatus || "unknown"),
      }),
      s.jsx("div", {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        children: j.map((N) => s.jsx(Di, { ...N }, N.label)),
      }),
      u.pendingRequests > 0 &&
        s.jsxs("button", {
          onClick: () => a("appointments"),
          className:
            "w-full flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100/70 transition-colors text-left",
          children: [
            s.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                s.jsx("div", {
                  className:
                    "w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0",
                  children: s.jsx(Si, { className: "w-5 h-5" }),
                }),
                s.jsxs("div", {
                  children: [
                    s.jsxs("p", {
                      className: "text-sm font-bold text-amber-900",
                      children: [
                        u.pendingRequests,
                        " appointment request",
                        u.pendingRequests === 1 ? "" : "s",
                        " waiting",
                      ],
                    }),
                    s.jsx("p", {
                      className: "text-xs text-amber-700",
                      children:
                        "Patients cannot attend until you confirm the slot.",
                    }),
                  ],
                }),
              ],
            }),
            s.jsx("span", {
              className: "text-xs font-bold text-amber-800 shrink-0",
              children: "Review →",
            }),
          ],
        }),
      s.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
        children: [
          s.jsxs("div", {
            className: "lg:col-span-2 space-y-3",
            children: [
              s.jsx("h3", {
                className: "text-sm font-bold text-slate-900",
                children: "Today's schedule",
              }),
              (h.appointments || []).length === 0
                ? s.jsx(Lt, {
                    icon: tr,
                    title: "Nothing booked today",
                    description:
                      "Confirmed visits for today will appear here with patient contact details.",
                  })
                : h.appointments.map((N) => {
                    var S, _, R;
                    return s.jsxs(
                      "div",
                      {
                        className:
                          "bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4",
                        children: [
                          s.jsxs("div", {
                            className: "flex items-center gap-3 min-w-0",
                            children: [
                              s.jsx("img", {
                                src: Dt(
                                  ((S = N.patient) == null ? void 0 : S.name) ||
                                    "Patient",
                                ),
                                alt: "",
                                className: "w-10 h-10 rounded-xl shrink-0",
                              }),
                              s.jsxs("div", {
                                className: "min-w-0",
                                children: [
                                  s.jsx("p", {
                                    className:
                                      "text-xs font-bold text-slate-900 truncate",
                                    children:
                                      ((_ = N.patient) == null
                                        ? void 0
                                        : _.name) || "Patient",
                                  }),
                                  s.jsxs("p", {
                                    className:
                                      "text-[11px] text-slate-500 truncate",
                                    children: [
                                      N.reason,
                                      " · ",
                                      (R = N.patient) == null
                                        ? void 0
                                        : R.phone,
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          s.jsxs("div", {
                            className: "text-right shrink-0",
                            children: [
                              s.jsxs("p", {
                                className:
                                  "text-xs font-bold text-slate-800 flex items-center gap-1 justify-end",
                                children: [
                                  s.jsx(qr, {
                                    className: "w-3 h-3 text-blue-500",
                                  }),
                                  new Date(N.scheduledStart).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: !0,
                                    },
                                  ),
                                ],
                              }),
                              s.jsxs("span", {
                                className:
                                  "text-[10px] font-semibold text-slate-500",
                                children: [
                                  ue(N.status),
                                  " · ",
                                  N.mode === "teleconsult"
                                    ? "Video"
                                    : "In-clinic",
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      N._id,
                    );
                  }),
            ],
          }),
          s.jsxs("div", {
            className:
              "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 self-start",
            children: [
              s.jsxs("div", {
                className:
                  "flex items-center gap-2 pb-3 border-b border-slate-100",
                children: [
                  s.jsx(hf, { className: "w-4 h-4 text-amber-500" }),
                  s.jsx("h3", {
                    className: "text-sm font-bold text-slate-900",
                    children: "Your practice",
                  }),
                ],
              }),
              s.jsx(xl, {
                label: "Verification",
                value: ue(y.verificationStatus || "--"),
              }),
              s.jsx(xl, {
                label: "Accepting patients",
                value: y.acceptingNewPatients ? "Yes" : "No",
                warn: !y.acceptingNewPatients,
              }),
              s.jsx(xl, {
                label: "Rating",
                value: `${((g = y.rating) == null ? void 0 : g.average) ?? 0} (${((E = y.rating) == null ? void 0 : E.count) ?? 0})`,
              }),
              s.jsx(xl, {
                label: "Unread notifications",
                value: u.unreadNotifications ?? 0,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function xl({ label: a, value: u, warn: o }) {
  return s.jsxs("div", {
    className: "flex items-center justify-between text-xs",
    children: [
      s.jsx("span", { className: "text-slate-500", children: a }),
      s.jsx("span", {
        className: `font-bold ${o ? "text-amber-600" : "text-slate-900"}`,
        children: u,
      }),
    ],
  });
}
const Jh = [
    { value: "requested", label: "Requests" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "", label: "All" },
  ],
  Ku = {
    requested: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rescheduled: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    no_show: "bg-slate-100 text-slate-500 border-slate-200",
  };
function Zh() {
  const [a, u] = P.useState("requested"),
    [o, m] = P.useState(null),
    [f, h] = P.useState(null),
    {
      data: j,
      error: y,
      loading: g,
      reload: E,
    } = $e(() => En.appointments({ status: a || void 0, limit: 100 }), [a]),
    N = j || [],
    S = async (_, R) => {
      var D;
      const $ = ((D = _.patient) == null ? void 0 : D.name) || "this patient";
      let C;
      if (R === "rejected") {
        if (((C = prompt(`Why are you declining ${$}'s request?`)), C === null))
          return;
      } else if (!confirm(`Mark ${$}'s appointment as ${R.replace("_", " ")}?`))
        return;
      m(_._id);
      try {
        (await En.setAppointmentStatus(_._id, R, C || void 0),
          h(`${$}: ${R.replace("_", " ")}.`),
          setTimeout(() => h(null), 4e3),
          await E());
      } catch (Q) {
        alert(Q.message);
      } finally {
        m(null);
      }
    };
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Appointments",
        description:
          "Confirm or decline incoming requests, then mark visits complete once the consultation is done.",
        badgeText: `${N.length} ${a ? ue(a) : "Total"}`,
      }),
      s.jsx("div", {
        className: "flex items-center gap-2 flex-wrap",
        children: Jh.map((_) =>
          s.jsx(
            "button",
            {
              onClick: () => u(_.value),
              className: `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${a === _.value ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
              children: _.label,
            },
            _.value || "all",
          ),
        ),
      }),
      f &&
        s.jsx("div", {
          className:
            "rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700",
          children: f,
        }),
      g
        ? s.jsx(He, { label: "Loading appointments..." })
        : y
          ? s.jsx(Ze, { error: y, onRetry: E })
          : N.length === 0
            ? s.jsx(Lt, {
                title:
                  a === "requested" ? "No requests waiting" : "Nothing here",
                description:
                  a === "requested"
                    ? "New patient bookings land here as requests until you confirm them."
                    : "Try a different filter.",
              })
            : s.jsx("div", {
                className: "space-y-3",
                children: N.map((_) => {
                  const R = _.patient || {},
                    $ = o === _._id;
                  return s.jsxs(
                    "div",
                    {
                      className: `bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${$ ? "opacity-50 pointer-events-none" : ""}`,
                      children: [
                        s.jsxs("div", {
                          className: "flex items-start gap-4 min-w-0",
                          children: [
                            s.jsx("img", {
                              src: Dt(R.name || "Patient"),
                              alt: "",
                              className: "w-12 h-12 rounded-2xl shrink-0",
                            }),
                            s.jsxs("div", {
                              className: "min-w-0 space-y-1",
                              children: [
                                s.jsxs("div", {
                                  className:
                                    "flex items-center gap-2 flex-wrap",
                                  children: [
                                    s.jsx("h4", {
                                      className:
                                        "font-bold text-slate-900 text-sm",
                                      children: R.name || "Patient",
                                    }),
                                    s.jsx("span", {
                                      className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${Ku[_.status] || Ku.completed}`,
                                      children: ue(_.status),
                                    }),
                                  ],
                                }),
                                s.jsx("p", {
                                  className:
                                    "text-xs text-slate-700 font-medium",
                                  children: _.reason,
                                }),
                                s.jsxs("div", {
                                  className:
                                    "flex flex-wrap items-center gap-3 text-[11px] text-slate-500",
                                  children: [
                                    s.jsxs("span", {
                                      className: "flex items-center gap-1",
                                      children: [
                                        s.jsx(qr, {
                                          className: "w-3 h-3 text-blue-500",
                                        }),
                                        Ri(_.scheduledStart),
                                      ],
                                    }),
                                    s.jsxs("span", {
                                      className: "flex items-center gap-1",
                                      children: [
                                        s.jsx(Kr, { className: "w-3 h-3" }),
                                        _.mode === "teleconsult"
                                          ? "Video consult"
                                          : "In-clinic",
                                      ],
                                    }),
                                    R.phone &&
                                      s.jsxs("span", {
                                        className: "flex items-center gap-1",
                                        children: [
                                          s.jsx(zi, { className: "w-3 h-3" }),
                                          R.phone,
                                        ],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        s.jsxs("div", {
                          className:
                            "flex items-center gap-2 shrink-0 self-end lg:self-auto",
                          children: [
                            $ &&
                              s.jsx(ht, {
                                className: "w-4 h-4 animate-spin text-blue-600",
                              }),
                            _.status === "requested" &&
                              s.jsxs(s.Fragment, {
                                children: [
                                  s.jsx(gl, {
                                    onClick: () => S(_, "confirmed"),
                                    tone: "emerald",
                                    icon: Mn,
                                    children: "Confirm",
                                  }),
                                  s.jsx(gl, {
                                    onClick: () => S(_, "rejected"),
                                    tone: "rose",
                                    icon: Jr,
                                    children: "Decline",
                                  }),
                                ],
                              }),
                            ["confirmed", "rescheduled"].includes(_.status) &&
                              s.jsxs(s.Fragment, {
                                children: [
                                  s.jsx(gl, {
                                    onClick: () => S(_, "completed"),
                                    tone: "blue",
                                    icon: l0,
                                    children: "Complete",
                                  }),
                                  s.jsx(gl, {
                                    onClick: () => S(_, "no_show"),
                                    tone: "slate",
                                    icon: z0,
                                    children: "No show",
                                  }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    },
                    _._id,
                  );
                }),
              }),
    ],
  });
}
const ex = {
  emerald: "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent",
  blue: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  rose: "bg-white border-rose-200 text-rose-600 hover:bg-rose-50",
  slate: "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
};
function gl({ onClick: a, tone: u, icon: o, children: m }) {
  return s.jsxs("button", {
    onClick: a,
    className: `flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${ex[u]}`,
    children: [s.jsx(o, { className: "w-3.5 h-3.5" }), m],
  });
}
const Gu = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
  Wr =
    "px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-blue-400",
  Xu = () => ({
    weekday: "monday",
    startTime: "09:00",
    endTime: "17:00",
    slotDurationMinutes: 30,
    mode: "in_person",
    isActive: !0,
  });
function tx() {
  const {
      data: a,
      error: u,
      loading: o,
      reload: m,
    } = $e(() => En.availability(), []),
    [f, h] = P.useState([]),
    [j, y] = P.useState({ busy: !1, saved: !1, error: null });
  P.useEffect(() => {
    a != null &&
      a.availability &&
      h(
        a.availability.map((N) => ({
          weekday: N.weekday,
          startTime: N.startTime,
          endTime: N.endTime,
          slotDurationMinutes: N.slotDurationMinutes,
          mode: N.mode,
          isActive: N.isActive,
        })),
      );
  }, [a]);
  const g = (N, S, _) =>
      h((R) => R.map(($, C) => (C === N ? { ...$, [S]: _ } : $))),
    E = async () => {
      y({ busy: !0, saved: !1, error: null });
      try {
        (await En.setAvailability(f),
          y({ busy: !1, saved: !0, error: null }),
          setTimeout(() => y((N) => ({ ...N, saved: !1 })), 2500),
          await m());
      } catch (N) {
        y({ busy: !1, saved: !1, error: N.message });
      }
    };
  return o
    ? s.jsx(He, { label: "Loading availability..." })
    : u
      ? s.jsx(Ze, { error: u, onRetry: m })
      : s.jsxs("div", {
          className: "space-y-6",
          children: [
            s.jsx(xt, {
              title: "Availability",
              description:
                "Your weekly template. Patients can only book inside these windows, split into slots of the length you choose.",
              badgeText: `${f.filter((N) => N.isActive).length} Active windows`,
            }),
            s.jsx("div", {
              className:
                "bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto",
              children: s.jsxs("table", {
                className: "w-full text-xs min-w-[720px]",
                children: [
                  s.jsx("thead", {
                    children: s.jsxs("tr", {
                      className:
                        "text-left text-slate-400 border-b border-slate-100",
                      children: [
                        s.jsx("th", {
                          className: "p-3 font-semibold",
                          children: "Day",
                        }),
                        s.jsx("th", {
                          className: "p-3 font-semibold",
                          children: "From",
                        }),
                        s.jsx("th", {
                          className: "p-3 font-semibold",
                          children: "To",
                        }),
                        s.jsx("th", {
                          className: "p-3 font-semibold",
                          children: "Slot length",
                        }),
                        s.jsx("th", {
                          className: "p-3 font-semibold",
                          children: "Mode",
                        }),
                        s.jsx("th", {
                          className: "p-3 font-semibold",
                          children: "Active",
                        }),
                        s.jsx("th", { className: "p-3" }),
                      ],
                    }),
                  }),
                  s.jsxs("tbody", {
                    children: [
                      f.length === 0 &&
                        s.jsx("tr", {
                          children: s.jsx("td", {
                            colSpan: 7,
                            className: "p-6 text-center text-slate-500",
                            children:
                              "No windows yet. Add one below - without availability you cannot be booked.",
                          }),
                        }),
                      f.map((N, S) =>
                        s.jsxs(
                          "tr",
                          {
                            className: "border-b border-slate-50 last:border-0",
                            children: [
                              s.jsx("td", {
                                className: "p-3",
                                children: s.jsx("select", {
                                  value: N.weekday,
                                  onChange: (_) =>
                                    g(S, "weekday", _.target.value),
                                  className: Wr,
                                  children: Gu.map((_) =>
                                    s.jsx(
                                      "option",
                                      { value: _, children: ue(_) },
                                      _,
                                    ),
                                  ),
                                }),
                              }),
                              s.jsx("td", {
                                className: "p-3",
                                children: s.jsx("input", {
                                  type: "time",
                                  value: N.startTime,
                                  onChange: (_) =>
                                    g(S, "startTime", _.target.value),
                                  className: Wr,
                                }),
                              }),
                              s.jsx("td", {
                                className: "p-3",
                                children: s.jsx("input", {
                                  type: "time",
                                  value: N.endTime,
                                  onChange: (_) =>
                                    g(S, "endTime", _.target.value),
                                  className: Wr,
                                }),
                              }),
                              s.jsx("td", {
                                className: "p-3",
                                children: s.jsx("select", {
                                  value: N.slotDurationMinutes,
                                  onChange: (_) =>
                                    g(
                                      S,
                                      "slotDurationMinutes",
                                      Number(_.target.value),
                                    ),
                                  className: Wr,
                                  children: [10, 15, 20, 30, 45, 60].map((_) =>
                                    s.jsxs(
                                      "option",
                                      { value: _, children: [_, " min"] },
                                      _,
                                    ),
                                  ),
                                }),
                              }),
                              s.jsx("td", {
                                className: "p-3",
                                children: s.jsxs("select", {
                                  value: N.mode,
                                  onChange: (_) => g(S, "mode", _.target.value),
                                  className: Wr,
                                  children: [
                                    s.jsx("option", {
                                      value: "in_person",
                                      children: "In-clinic",
                                    }),
                                    s.jsx("option", {
                                      value: "teleconsult",
                                      children: "Video",
                                    }),
                                  ],
                                }),
                              }),
                              s.jsx("td", {
                                className: "p-3",
                                children: s.jsx("input", {
                                  type: "checkbox",
                                  checked: N.isActive,
                                  onChange: (_) =>
                                    g(S, "isActive", _.target.checked),
                                  className: "w-4 h-4 rounded text-blue-600",
                                }),
                              }),
                              s.jsx("td", {
                                className: "p-3 text-right",
                                children: s.jsx("button", {
                                  onClick: () =>
                                    h((_) => _.filter((R, $) => $ !== S)),
                                  className:
                                    "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
                                  title: "Remove window",
                                  children: s.jsx(vf, {
                                    className: "w-3.5 h-3.5",
                                  }),
                                }),
                              }),
                            ],
                          },
                          S,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
            }),
            s.jsxs("div", {
              className: "flex items-center gap-3 flex-wrap",
              children: [
                s.jsxs("button", {
                  onClick: () => h((N) => [...N, Xu()]),
                  className:
                    "flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors",
                  children: [
                    s.jsx(N0, { className: "w-3.5 h-3.5" }),
                    "Add window",
                  ],
                }),
                s.jsx("button", {
                  onClick: () =>
                    h(Gu.slice(0, 6).map((N) => ({ ...Xu(), weekday: N }))),
                  className:
                    "px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors",
                  children: "Fill Mon-Sat 09:00-17:00",
                }),
                s.jsxs("button", {
                  onClick: E,
                  disabled: j.busy,
                  className:
                    "flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors ml-auto",
                  children: [
                    j.busy
                      ? s.jsx(ht, { className: "w-3.5 h-3.5 animate-spin" })
                      : j.saved
                        ? s.jsx(Mn, { className: "w-3.5 h-3.5" })
                        : null,
                    j.saved ? "Saved" : "Save availability",
                  ],
                }),
              ],
            }),
            j.error &&
              s.jsx("div", {
                className:
                  "rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-semibold text-rose-700",
                children: j.error,
              }),
            s.jsx("p", {
              className: "text-[11px] text-slate-400",
              children:
                "Each window must divide evenly into the slot length - 09:00 to 17:00 works with 30 minutes, but not with 45.",
            }),
          ],
        });
}
const Pt =
  "w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white outline-none transition-all";
function nx() {
  const {
      data: a,
      error: u,
      loading: o,
      reload: m,
    } = $e(() => En.profile(), []),
    [f, h] = P.useState(null),
    [j, y] = P.useState({ busy: !1, saved: !1, error: null });
  if (
    (P.useEffect(() => {
      var N, S, _;
      a &&
        h({
          specialties: (a.specialties || []).join(", "),
          experienceYears: a.experienceYears ?? 0,
          consultationFee: a.consultationFee ?? "",
          teleconsultFee: a.teleconsultFee ?? "",
          languages: (a.languages || []).join(", "),
          bio: a.bio || "",
          acceptingNewPatients: a.acceptingNewPatients ?? !0,
          city: ((N = a.practiceLocation) == null ? void 0 : N.city) || "",
          district:
            ((S = a.practiceLocation) == null ? void 0 : S.district) || "",
          state: ((_ = a.practiceLocation) == null ? void 0 : _.state) || "",
        });
    }, [a]),
    o || !f)
  )
    return s.jsx(He, { label: "Loading your profile..." });
  if (u) return s.jsx(Ze, { error: u, onRetry: m });
  const g = (N) => (S) =>
      h((_) => ({
        ..._,
        [N]: S.target.type === "checkbox" ? S.target.checked : S.target.value,
      })),
    E = async () => {
      y({ busy: !0, saved: !1, error: null });
      try {
        const N = (_) =>
            _.split(",")
              .map((R) => R.trim())
              .filter(Boolean),
          S = {
            specialties: N(f.specialties),
            languages: N(f.languages),
            experienceYears: Number(f.experienceYears),
            acceptingNewPatients: f.acceptingNewPatients,
            bio: f.bio || void 0,
          };
        (f.consultationFee !== "" &&
          (S.consultationFee = Number(f.consultationFee)),
          f.teleconsultFee !== "" &&
            (S.teleconsultFee = Number(f.teleconsultFee)),
          (f.city || f.district || f.state) &&
            (S.practiceLocation = {
              city: f.city || void 0,
              district: f.district || void 0,
              state: f.state || void 0,
            }),
          await En.updateProfile(S),
          y({ busy: !1, saved: !0, error: null }),
          setTimeout(() => y((_) => ({ ..._, saved: !1 })), 2500),
          await m());
      } catch (N) {
        y({ busy: !1, saved: !1, error: N.message });
      }
    };
  return s.jsxs("div", {
    className: "space-y-6",
    children: [
      s.jsx(xt, {
        title: "Practice Profile",
        description:
          "What patients see in search results. Registration number and verification are managed by an admin.",
        badgeText: ue(a.verificationStatus || "unknown"),
      }),
      s.jsxs("div", {
        className:
          "bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4",
        children: [
          s.jsxs("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
            children: [
              s.jsx(Rt, {
                label: "Specialties",
                hint: "Comma separated",
                children: s.jsx("input", {
                  value: f.specialties,
                  onChange: g("specialties"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "Languages",
                hint: "Comma separated",
                children: s.jsx("input", {
                  value: f.languages,
                  onChange: g("languages"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "Years of experience",
                children: s.jsx("input", {
                  type: "number",
                  min: "0",
                  value: f.experienceYears,
                  onChange: g("experienceYears"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "Registration number",
                hint: "Admin-managed, read only",
                children: s.jsx("input", {
                  value: a.registrationNumber || "--",
                  readOnly: !0,
                  className: `${Pt} opacity-60`,
                }),
              }),
              s.jsx(Rt, {
                label: "In-clinic fee (₹)",
                children: s.jsx("input", {
                  type: "number",
                  min: "0",
                  value: f.consultationFee,
                  onChange: g("consultationFee"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "Video consult fee (₹)",
                children: s.jsx("input", {
                  type: "number",
                  min: "0",
                  value: f.teleconsultFee,
                  onChange: g("teleconsultFee"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "City",
                children: s.jsx("input", {
                  value: f.city,
                  onChange: g("city"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "District",
                children: s.jsx("input", {
                  value: f.district,
                  onChange: g("district"),
                  className: Pt,
                }),
              }),
              s.jsx(Rt, {
                label: "State",
                children: s.jsx("input", {
                  value: f.state,
                  onChange: g("state"),
                  className: Pt,
                }),
              }),
            ],
          }),
          s.jsx(Rt, {
            label: "Bio",
            hint: "Shown on your profile card",
            children: s.jsx("textarea", {
              rows: 3,
              value: f.bio,
              onChange: g("bio"),
              className: `${Pt} resize-none`,
            }),
          }),
          s.jsxs("label", {
            className:
              "flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs cursor-pointer",
            children: [
              s.jsxs("div", {
                children: [
                  s.jsx("span", {
                    className: "font-bold text-slate-700",
                    children: "Accepting new patients",
                  }),
                  s.jsx("p", {
                    className: "text-[11px] text-slate-500",
                    children:
                      "Turning this off marks you offline in patient search.",
                  }),
                ],
              }),
              s.jsx("input", {
                type: "checkbox",
                checked: f.acceptingNewPatients,
                onChange: g("acceptingNewPatients"),
                className: "w-4 h-4 rounded text-blue-600",
              }),
            ],
          }),
          s.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              s.jsxs("button", {
                onClick: E,
                disabled: j.busy,
                className:
                  "flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors",
                children: [
                  j.busy
                    ? s.jsx(ht, { className: "w-3.5 h-3.5 animate-spin" })
                    : j.saved
                      ? s.jsx(Mn, { className: "w-3.5 h-3.5" })
                      : null,
                  j.saved ? "Saved" : "Save profile",
                ],
              }),
              j.error &&
                s.jsx("p", {
                  className: "text-[11px] text-rose-600 font-medium",
                  children: j.error,
                }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Rt({ label: a, hint: u, children: o }) {
  return s.jsxs("div", {
    children: [
      s.jsxs("label", {
        className: "text-xs text-slate-500 font-medium block mb-1",
        children: [
          a,
          u &&
            s.jsxs("span", {
              className: "text-slate-400 font-normal",
              children: [" · ", u],
            }),
        ],
      }),
      o,
    ],
  });
}
const rx = [
  { id: "dashboard", label: "Overview", icon: Fd },
  { id: "appointments", label: "Appointments", icon: Si },
  { id: "availability", label: "Availability", icon: s0 },
  { id: "profile", label: "Practice profile", icon: Xr },
];
function sx() {
  const { user: a, logout: u } = At(),
    [o, m] = P.useState("dashboard"),
    f = () => {
      switch (o) {
        case "appointments":
          return s.jsx(Zh, {});
        case "availability":
          return s.jsx(tx, {});
        case "profile":
          return s.jsx(nx, {});
        default:
          return s.jsx(Xh, { onNavigate: m });
      }
    };
  return s.jsxs("div", {
    className: "flex min-h-screen bg-[#F8FAFC]",
    children: [
      s.jsxs("aside", {
        className:
          "w-60 bg-[#0D2040] text-slate-300 flex flex-col shrink-0 border-r border-slate-800",
        children: [
          s.jsxs("div", {
            className:
              "h-16 flex items-center gap-2.5 px-5 border-b border-slate-800/80",
            children: [
              s.jsx("div", {
                className:
                  "w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center",
                children: s.jsx(Xr, { className: "w-5 h-5" }),
              }),
              s.jsxs("div", {
                className: "leading-none",
                children: [
                  s.jsx("p", {
                    className: "text-sm font-black text-white tracking-tight",
                    children: "Swasthya Setu",
                  }),
                  s.jsx("span", {
                    className:
                      "text-[10px] font-semibold text-emerald-400 uppercase tracking-wide",
                    children: "Doctor console",
                  }),
                ],
              }),
            ],
          }),
          s.jsx("nav", {
            className: "flex-1 p-3 space-y-1.5",
            children: rx.map(({ id: h, label: j, icon: y }) =>
              s.jsxs(
                "button",
                {
                  onClick: () => m(h),
                  className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${o === h ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold" : "text-slate-300 hover:bg-white/5 hover:text-white"}`,
                  children: [
                    s.jsx(y, {
                      className: `w-4 h-4 ${o === h ? "text-white" : "text-slate-400"}`,
                    }),
                    s.jsx("span", { children: j }),
                  ],
                },
                h,
              ),
            ),
          }),
          s.jsxs("div", {
            className: "p-3 border-t border-slate-800 space-y-2",
            children: [
              s.jsxs("div", {
                className: "flex items-center gap-2.5 px-2",
                children: [
                  s.jsx("img", {
                    src: Dt((a == null ? void 0 : a.name) || "Doctor"),
                    alt: "",
                    className: "w-8 h-8 rounded-full",
                  }),
                  s.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      s.jsx("p", {
                        className: "text-xs font-bold text-white truncate",
                        children: a == null ? void 0 : a.name,
                      }),
                      s.jsx("span", {
                        className: "text-[10px] text-slate-400",
                        children: a == null ? void 0 : a.phone,
                      }),
                    ],
                  }),
                ],
              }),
              s.jsxs("button", {
                onClick: u,
                className:
                  "w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors",
                children: [s.jsx(Nl, { className: "w-3.5 h-3.5" }), "Sign out"],
              }),
            ],
          }),
        ],
      }),
      s.jsx("main", {
        className:
          "flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn min-w-0",
        children: f(),
      }),
    ],
  });
}
function lx() {
  const { isAuthenticated: a, booting: u, user: o } = At(),
    [m, f] = P.useState("home"),
    [h, j] = P.useState("");
  if (u)
    return s.jsx("div", {
      className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center",
      children: s.jsx(ht, { className: "w-6 h-6 animate-spin text-blue-600" }),
    });
  if (!a) return s.jsx(Lh, {});
  if (o.role === "admin") return s.jsx(Gh, {});
  if (o.role === "doctor") return s.jsx(sx, {});
  if (o.role !== "patient") return s.jsx(Oh, { role: o.role });
  const y = () => {
    switch (m) {
      case "home":
        return s.jsx(Wu, { onNavigate: f });
      case "appointments":
        return s.jsx(fh, { onNavigateDoctors: () => f("doctors") });
      case "doctors":
        return s.jsx(wh, { initialSearch: h });
      case "records":
        return s.jsx(Ch, {});
      case "profile":
        return s.jsx(Rh, {});
      default:
        return s.jsx(Wu, { onNavigate: f });
    }
  };
  return s.jsxs("div", {
    className: "flex min-h-screen bg-[#F8FAFC]",
    children: [
      s.jsx(B0, { activeTab: m, onSelectTab: f }),
      s.jsxs("div", {
        className: "flex-1 flex flex-col min-w-0",
        children: [
          s.jsx(Z0, {
            onNavigateProfile: () => f("profile"),
            onGlobalSearch: (g) => {
              (j(g), g.trim() && f("doctors"));
            },
          }),
          s.jsx("main", {
            className:
              "flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn",
            children: y(),
          }),
        ],
      }),
    ],
  });
}
Ip.createRoot(document.getElementById("root")).render(
  s.jsx(Rp.StrictMode, { children: s.jsx(V0, { children: s.jsx(lx, {}) }) }),
);
