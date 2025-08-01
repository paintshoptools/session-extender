console.log('This script has been injected into page context');
if (typeof ExtendSession === "function") {
  try {
	ExtendSession();  // Or pass args: window.myFunction(arg1, arg2)
	console.log("✅ ExtendSession was called successfully.");
  } catch (err) {
	console.error("❌ ExtendSession exists, but threw an error:", err);
  }
} else {
  console.warn("⚠️ ExtendSession is not defined or not a function.");
}
