export interface PrincipleStory {
  example: string;
  overview: string;
  problemStatement: string;
  tradeoffIntro?: string;
  scene: [string, string, string];
  without: [string, string, string];
  with: [string, string, string];
  codeBridge: string;
  codeBeforeHint: string;
  codeAfterHint: string;
  tryItSteps: string[];
}

export const principleStories: Record<string, PrincipleStory> = {
  'single-responsibility': {
    example: 'Busy restaurant',
    overview:
      'Picture a small restaurant at dinner rush. The waiter takes orders, the chef cooks at the grill, and the cashier rings people up. Each person has one clear job — nobody is expected to greet tables, flip burgers, and count the till at the same time. Classes work the same way: one reason to change per class.',
    problemStatement:
      'When one RestaurantEmployee class takes orders, cooks, and bills, a menu tweak can accidentally break payment math. Tests need the whole kitchen running just to verify billing. It is like asking one person to be waiter, chef, and cashier — any change to the menu risks breaking the till.',
    tradeoffIntro:
      'Same restaurant example: without SRP, one employee class does everything. With SRP, Waiter, Chef, and Cashier each own one step of the meal.',
    scene: [
      'A customer sits down and tells the waiter “margherita pizza.” The waiter writes the ticket and passes it to the kitchen — they do not leave the dining room to operate the oven.',
      'The chef reads the ticket and cooks the pizza. When it is ready, the cashier prints the bill from the order total — not from whatever the waiter remembers off the top of their head.',
      'If one person tried to do all three jobs during rush hour, orders would be wrong, food would burn, and payments would be missed. Splitting roles keeps each step reliable.',
    ],
    without: [
      'RestaurantEmployee mixes takeOrder(), cook(), and bill() — three unrelated reasons to change in one class.',
      'Updating the menu format forces you to retest billing logic even though billing did not change.',
      'Unit tests cannot check “cooking” without also constructing order and payment state.',
    ],
    with: [
      'Waiter only changes when ordering rules change; Chef when recipes change; Cashier when tax rules change.',
      'Each class is small enough to read in one screen and test in isolation.',
      'New staff roles (host, barista) plug in without bloating an existing class.',
    ],
    codeBridge: 'Same restaurant flow in Java: three focused classes instead of one “do everything” employee.',
    codeBeforeHint: 'Without SRP — one class handles order, cook, and bill (three jobs, one file).',
    codeAfterHint: 'With SRP — Waiter, Chef, and Cashier each do one job in the same meal workflow.',
    tryItSteps: ['Run ▶ — expect Order, Cooking, and Bill lines from three separate roles.'],
  },

  'open-closed': {
    example: 'Shipping promotions',
    overview:
      'Your online shop charges shipping at checkout. Marketing keeps inventing promos: flat $5, free shipping over $50, holiday half-off. A good checkout system adds each promo as a new rule card — you do not open the cash register and rewrite its firmware every Tuesday.',
    problemStatement:
      'When ShippingCalculator is one long if/else chain, every new promo means editing the same method, re-running every test, and praying you did not break “free shipping Friday.” Extension should mean new classes, not surgery on stable code.',
    tradeoffIntro:
      'Same shipping example: without OCP, you edit the calculator for each promo. With OCP, you add a new ShippingRule class and plug it in.',
    scene: [
      'Today’s rule is flat $5 shipping. The calculator applies it and prints the fee — simple.',
      'Marketing launches “free shipping over $50.” With a rule interface, you add FreeOverFiftyRule without touching yesterday’s flat-rate logic.',
      'Next month: “10% of subtotal.” Another new class — the calculator loop stays the same; only the rule list grows.',
    ],
    without: [
      'Every promo adds another else-if branch in one method — merge conflicts every sprint.',
      'A bug fix for holiday shipping risks breaking the default flat rate in the same method.',
      'Third-party plugins cannot add rules without forking your calculator.',
    ],
    with: [
      'ShippingCalculator depends on ShippingRule — it never changes when marketing invents promos.',
      'Each rule is a tiny, testable class with one job.',
      'You can enable/disable rules per environment without conditional spaghetti.',
    ],
    codeBridge: 'Same checkout shipping fees: plug-in rules instead of growing if/else.',
    codeBeforeHint: 'Without OCP — one method with if/else for every promo type.',
    codeAfterHint: 'With OCP — calculator + ShippingRule implementations; add promos with new classes.',
    tryItSteps: ['Run ▶ — expect fees from flat rate and free-shipping rules without editing the calculator.'],
  },

  'liskov-substitution': {
    example: 'Car rental counter',
    overview:
      'You rent a car from a counter that promises “any Vehicle drives off the lot.” Gas or electric, the contract says you get something you can drive. It should never hand you a car that explodes when the clerk runs the standard “refuel before return” checklist.',
    problemStatement:
      'When ElectricCar extends GasCar and refuel() throws an exception, rental software that accepts Vehicle breaks for EVs. Subtypes must honor the contract callers expect — or you redesign the hierarchy so refuel is not part of the base story.',
    tradeoffIntro:
      'Same rental desk: without LSP, ElectricCar breaks code that assumes every car refuels. With LSP, drive() is on Vehicle; refuel() only on cars that actually have a gas tank.',
    scene: [
      'A customer rents “any available car.” The system calls vehicle.drive() — works for gas and electric alike.',
      'Before return, the clerk runs refuel() only on cars that implement Refuelable. Electric cars skip that step — no exception, no surprise.',
      'Callers never need instanceof ElectricCar to avoid blowing up — the type system matches real-world behavior.',
    ],
    without: [
      'ElectricCar extends GasCar but refuel() throws — callers crash on a valid Vehicle reference.',
      'Rental code sprinkles instanceof checks to work around broken inheritance.',
      'The “is-a” relationship lies: an electric car is not a gas car with a broken tank.',
    ],
    with: [
      'Vehicle guarantees drive(); Refuelable guarantees refuel() — only where it makes sense.',
      'ElectricCar and GasCar are interchangeable wherever only drive() matters.',
      'New hybrids implement both interfaces without faking behavior.',
    ],
    codeBridge: 'Same rental counter: shared drive(), refuel only on cars that need gas.',
    codeBeforeHint: 'Without LSP — ElectricCar extends GasCar; refuel() throws on a Vehicle reference.',
    codeAfterHint: 'With LSP — Vehicle + Refuelable; electric and gas cars substitute safely.',
    tryItSteps: ['Run ▶ — expect both cars to drive(); only the gas car refuels.'],
  },

  'interface-segregation': {
    example: 'Office devices',
    overview:
      'A floor-standing office copier prints, scans, and faxes — great. Your pocket phone only makes calls. Forcing the phone to implement fax() “because SmartDevice says so” is absurd — yet fat Java interfaces do exactly that.',
    problemStatement:
      'When SimplePhone must implement print() and fax() with UnsupportedOperationException, every caller of SmartDevice might accidentally invoke a method the phone never supported. Interfaces should describe what a class actually offers, not everything in the building.',
    tradeoffIntro:
      'Same office gear: without ISP, SimplePhone stubs fax. With ISP, Callable and Faxable are separate — clients ask only for what they need.',
    scene: [
      'You pick up the desk phone and dial a client — Callable.call() is all you need.',
      'Down the hall, the copier prints a contract and faxes a signed copy — it implements Printable and Faxable.',
      'Nobody hands the receptionist a “smart device” manual that says “press fax on your mobile” — roles match capabilities.',
    ],
    without: [
      'SmartDevice bundles call, print, and fax — phones throw on half the methods.',
      'Code depending on SmartDevice can accidentally call fax() on a phone.',
      'Adding scan() to the fat interface forces every implementer to update — even phones.',
    ],
    with: [
      'Callable, Printable, Faxable — implement only what the device can do.',
      'Reception uses Callable; mail room uses Faxable — no dead methods.',
      'New Scannable interface affects only devices with scanners.',
    ],
    codeBridge: 'Same office: skinny interfaces instead of one fat SmartDevice contract.',
    codeBeforeHint: 'Without ISP — SimplePhone must stub print() and fax() it will never use.',
    codeAfterHint: 'With ISP — phone implements Callable; copier implements print and fax.',
    tryItSteps: ['Run ▶ — expect a phone call and copier print/fax with no thrown stubs.'],
  },

  'dependency-inversion': {
    example: 'Home lighting',
    overview:
      'Flip a wall switch and the room lights up. The switch does not solder itself to one bulb brand — it connects to a standard outlet. Swap Philips for LED strips without rewiring the wall. Software modules should depend on that kind of standard, not concrete vendors.',
    problemStatement:
      'When LightSwitch does new PhilipsBulb() inside the class, changing brands means editing the switch. High-level “turn on the light” policy should not be locked to low-level “Philips warm glow” detail.',
    tradeoffIntro:
      'Same light switch: without DIP, the switch builds a Philips bulb. With DIP, it receives any Light through the constructor.',
    scene: [
      'You flip the switch. It calls light.illuminate() — it does not care which bulb is screwed in.',
      'Moving day: you plug an LedStrip into the same switch wiring. The switch class never changes.',
      'Tests inject a FakeLight that records flip() — no real hardware needed.',
    ],
    without: [
      'LightSwitch constructs PhilipsBulb directly — vendor lock-in in one line.',
      'Swapping to LED means editing and redeploying the switch class.',
      'Tests cannot run without the real bulb implementation.',
    ],
    with: [
      'LightSwitch depends on Light — an abstraction both Philips and LED implement.',
      'LivingRoom wires concrete bulbs at the composition root.',
      'New smart bulbs implement Light without touching the switch.',
    ],
    codeBridge: 'Same wall switch: depend on Light, inject Philips or LED at setup.',
    codeBeforeHint: 'Without DIP — switch hard-codes new PhilipsBulb().',
    codeAfterHint: 'With DIP — constructor-injected Light; swap bulbs without editing the switch.',
    tryItSteps: ['Run ▶ — expect the same switch to light Philips or LED depending on injection.'],
  },
};

/** @deprecated */
export const patternStories = principleStories;
export type PatternStory = PrincipleStory;
