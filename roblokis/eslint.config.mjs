// eslint.config.mjs
import antfu from "@antfu/eslint-config";

export default antfu({
	ignores: [
		"html/SettingsPage/Pages/Main/designer.js",
		"js/Scripts",
	],
	stylistic: {
		indent: "tab",
		quotes: "double",
		semi: true,
	},
	rules: {
		"eqeqeq": ["error", "smart"],
		"no-console": "off",
		"style/semi": ["error", "always", {
			omitLastInOneLineBlock: false,
			omitLastInOneLineClassBody: false,
		}],
		"style/no-extra-semi": "error",
		"style/no-extra-parens": ["error", "all"],
	},
});
