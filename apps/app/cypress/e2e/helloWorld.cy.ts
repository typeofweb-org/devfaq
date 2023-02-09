describe("hello world", () => {
	it("visit home page", () => {
		cy.visit("/");
		cy.get("h1").should("contain", "DevFAQ");
	});
});

export {};
