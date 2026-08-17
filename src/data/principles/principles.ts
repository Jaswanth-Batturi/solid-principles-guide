import type { Principle } from './types';

export const principles: Principle[] = [
  {
    slug: 'single-responsibility',
    name: 'Single Responsibility Principle',
    letter: 's',
    oneLiner: 'One job per class — like a restaurant where the waiter, chef, and cashier each do one role.',
    analogy:
      'At a busy restaurant the waiter takes orders, the chef cooks, and the cashier handles payment. Nobody expects the waiter to also run the grill and count the till — each role has one clear job.',
    analogyIcon: '🍽️',
    problem:
      'When one class handles ordering, cooking, and billing, every small change ripples through unrelated code. A menu update can break payment logic, and the class becomes impossible to test in isolation.',
    solution:
      'Give each class exactly one reason to change. Split RestaurantEmployee into Waiter, Chef, and Cashier — each owns one slice of the workflow and can evolve independently.',
    whenToUse: [
      'A class name already contains “And”, “Manager”, or “Handler” for unrelated tasks',
      'Changing one feature forces edits in unrelated methods of the same class',
      'You cannot unit-test one behavior without setting up half the system',
      'Examples: split reporting from persistence, UI from business rules',
    ],
    whenNotToUse: [
      'You split so aggressively that a simple workflow needs ten tiny classes',
      'The responsibilities are genuinely inseparable and always change together',
      'You are prematurely abstracting a 20-line script',
    ],
    relatedPrinciples: ['open-closed', 'interface-segregation'],
    codeBefore: `// One person does everything — menu change risks payment bugs
class RestaurantEmployee {
    void takeOrder(String dish) { System.out.println("Order: " + dish); }
    void cook(String dish) { System.out.println("Cooking: " + dish); }
    void bill(double amount) { System.out.println("Bill: $" + amount); }
}`,
    codeAfter: `// Each role has one job
class Waiter { void takeOrder(String dish) { System.out.println("Order: " + dish); } }
class Chef { void cook(String dish) { System.out.println("Cooking: " + dish); } }
class Cashier { void bill(double amount) { System.out.println("Bill: $" + amount); } }`,
    quiz: [
      {
        question: 'SRP means a class should have…',
        options: [
          'Only one method',
          'Only one reason to change',
          'No dependencies on other classes',
          'Exactly one instance',
        ],
        correctIndex: 1,
        explanation:
          'Single Responsibility is about cohesion: one class, one job — not literally one method.',
      },
      {
        question: 'A classic SRP smell is…',
        options: [
          'A UserRepository with only save() and findById()',
          'A ReportGenerator that also sends email and writes to the database',
          'A small Value Object with two fields',
          'An interface with one method',
        ],
        correctIndex: 1,
        explanation:
          'When unrelated concerns live in one class, every change risks breaking something else.',
      },
    ],
  },
  {
    slug: 'open-closed',
    name: 'Open/Closed Principle',
    letter: 'o',
    oneLiner: 'Add new shipping rules without editing the calculator — like plugging in a new discount card.',
    analogy:
      'A coffee shop loyalty program: you add a “double points Tuesday” promotion by dropping in a new rule card — you do not rewrite the cash register firmware every time marketing invents a promo.',
    analogyIcon: '📦',
    problem:
      'When ShippingCalculator is one giant if/else chain, every new discount type means editing and retesting the same class. Production calculators become fragile and merge-conflict magnets.',
    solution:
      'Define a ShippingRule interface. The calculator loops rules; new promotions are new classes. Existing code stays closed for modification but open for extension.',
    whenToUse: [
      'You keep adding else-if branches for new variants of the same behavior',
      'Plugin-style extensibility matters (tax rules, pricing, validators)',
      'You want third parties to add behavior without forking core code',
      'Examples: payment fees, export formats, notification channels',
    ],
    whenNotToUse: [
      'You have one rule that will never grow — a strategy interface adds noise',
      'The variation is a one-off bug fix, not a family of behaviors',
      'You cannot identify a stable abstraction to extend',
    ],
    relatedPrinciples: ['dependency-inversion', 'liskov-substitution'],
    codeBefore: `// Every new promo edits this class
class ShippingCalculator {
    double calculate(double subtotal, String promo) {
        if (promo.equals("flat")) return 5.0;
        if (promo.equals("free")) return 0.0;
        return subtotal * 0.1;
    }
}`,
    codeAfter: `interface ShippingRule { double fee(double subtotal); }
class FlatRateRule implements ShippingRule { public double fee(double s) { return 5.0; } }
class FreeShippingRule implements ShippingRule { public double fee(double s) { return 0.0; } }
class ShippingCalculator {
    double calculate(double subtotal, ShippingRule rule) { return rule.fee(subtotal); }
}`,
    quiz: [
      {
        question: 'Open/Closed encourages you to…',
        options: [
          'Never change existing code',
          'Extend behavior with new code instead of editing stable code',
          'Keep all classes final',
          'Use only abstract classes',
        ],
        correctIndex: 1,
        explanation:
          'The goal is to add features via new types (extension) rather than modifying tested core logic.',
      },
      {
        question: 'Which smell violates OCP?',
        options: [
          'Adding HolidayDiscountRule as a new class',
          'Growing a switch statement every sprint for new discount types',
          'Injecting a list of rules into a calculator',
          'Using polymorphism for export formats',
        ],
        correctIndex: 1,
        explanation:
          'Repeated edits to one method for each new variant is the classic OCP violation.',
      },
    ],
  },
  {
    slug: 'liskov-substitution',
    name: 'Liskov Substitution Principle',
    letter: 'l',
    oneLiner: 'Any car you rent should drive off the lot — electric or gas — without surprising the customer.',
    analogy:
      'A rental counter promises “any Vehicle works.” You should not hand someone an electric car that crashes the contract because the system assumes every car needs a gas fill-up before return.',
    analogyIcon: '🚗',
    problem:
      'When ElectricCar extends GasCar and overrides refuel() to throw an exception, client code that accepts Vehicle breaks. Subtypes that surprise callers violate the mental model of the base type.',
    solution:
      'Model shared behavior on a Vehicle interface (drive). Put refuel() only on Refuelable cars. ElectricCar and GasCar are both Vehicles; only GasCar implements Refuelable — no fake or throwing overrides.',
    whenToUse: [
      'Subclasses override methods with “not supported” or empty implementations',
      'Callers need instanceof checks before using a subtype',
      'Base-class contracts (pre/post conditions) are stronger than subclasses can honor',
      'Examples: shapes, birds that cannot fly, read-only collections',
    ],
    whenNotToUse: [
      'You are over-engineering when a simple union type or separate hierarchy suffices',
      'The domain genuinely has incompatible subtypes — use composition instead of inheritance',
    ],
    relatedPrinciples: ['interface-segregation', 'single-responsibility'],
    codeBefore: `// ElectricCar "is-a" GasCar but refuel() blows up — rental desk breaks
class GasCar {
    void drive() { System.out.println("Driving…"); }
    void refuel() { System.out.println("Filling gas tank"); }
}
class ElectricCar extends GasCar {
    @Override void refuel() { throw new UnsupportedOperationException("No gas tank!"); }
}`,
    codeAfter: `interface Vehicle { void drive(); }
interface Refuelable { void refuel(); }
class GasCar implements Vehicle, Refuelable {
    public void drive() { System.out.println("Gas car driving"); }
    public void refuel() { System.out.println("Filling gas tank"); }
}
class ElectricCar implements Vehicle {
    public void drive() { System.out.println("Electric car driving"); }
}`,
    quiz: [
      {
        question: 'LSP is about…',
        options: [
          'Making all methods public',
          'Subtypes being safely usable wherever the base type is expected',
          'Using the largest interface possible',
          'Preferring composition over inheritance always',
        ],
        correctIndex: 1,
        explanation:
          'If code works with the parent type, it must work with any proper subtype — no surprises.',
      },
      {
        question: 'Square extending Rectangle and breaking setWidth is a famous…',
        options: ['SRP violation', 'OCP violation', 'LSP violation', 'DIP violation'],
        correctIndex: 2,
        explanation:
          'Square changes Rectangle invariants — callers expecting Rectangle behavior get wrong results.',
      },
    ],
  },
  {
    slug: 'interface-segregation',
    name: 'Interface Segregation Principle',
    letter: 'i',
    oneLiner: 'A phone should not be forced to implement fax — split the all-in-one machine into focused interfaces.',
    analogy:
      'An office all-in-one printer scans, prints, and faxes. Your mobile phone only needs to make calls — forcing it to implement fax() with “not supported” is the same pain as fat Java interfaces.',
    analogyIcon: '📱',
    problem:
      'When SmartDevice forces print(), scan(), and fax() on every implementation, SimplePhone must stub or throw for features it will never have. Clients depend on methods they do not use.',
    solution:
      'Split into Callable, Printable, Scannable, and Faxable. SimplePhone implements Callable only; OfficeCopier implements all four. Clients depend on the smallest interface they need.',
    whenToUse: [
      'Implementations leave methods empty or throw UnsupportedOperationException',
      'Clients import huge interfaces but call one or two methods',
      'Fat interfaces couple unrelated teams to the same contract',
      'Examples: repository blobs, “God” service interfaces, fat JPA entities',
    ],
    whenNotToUse: [
      'The interface is already tiny and cohesive',
      'Splitting would scatter one logical capability across five one-method types with no benefit',
    ],
    relatedPrinciples: ['single-responsibility', 'dependency-inversion'],
    codeBefore: `// Phone forced to "implement" fax it will never support
interface SmartDevice {
    void call(String number);
    void print(String doc);
    void fax(String doc);
}
class SimplePhone implements SmartDevice {
    public void call(String number) { System.out.println("Calling " + number); }
    public void print(String doc) { throw new UnsupportedOperationException(); }
    public void fax(String doc) { throw new UnsupportedOperationException(); }
}`,
    codeAfter: `interface Callable { void call(String number); }
interface Printable { void print(String doc); }
interface Faxable { void fax(String doc); }
class SimplePhone implements Callable {
    public void call(String number) { System.out.println("Calling " + number); }
}
class OfficeCopier implements Printable, Faxable {
    public void print(String doc) { System.out.println("Printing " + doc); }
    public void fax(String doc) { System.out.println("Faxing " + doc); }
}`,
    quiz: [
      {
        question: 'ISP tells you to…',
        options: [
          'Use only one interface per class',
          'Avoid forcing classes to implement methods they do not need',
          'Never use interfaces',
          'Merge small interfaces into one large one',
        ],
        correctIndex: 1,
        explanation:
          'Prefer several specific interfaces over one “kitchen sink” contract.',
      },
      {
        question: 'Empty or throwing method bodies in an implementation often signal…',
        options: ['DIP violation', 'ISP violation', 'LSP violation', 'Perfect design'],
        correctIndex: 1,
        explanation:
          'If you must stub methods, the interface is probably too fat for that class.',
      },
    ],
  },
  {
    slug: 'dependency-inversion',
    name: 'Dependency Inversion Principle',
    letter: 'd',
    oneLiner: 'Wire the light switch to an outlet standard — not directly to one bulb brand.',
    analogy:
      'Home wiring uses a standard outlet. The wall switch does not care if you plug in a Philips bulb or an LED strip — it depends on the PowerSource contract, not a concrete manufacturer.',
    analogyIcon: '💡',
    problem:
      'When LightSwitch does new PhilipsBulb() internally, swapping brands means editing the switch class. High-level policy (turning lights on) is glued to low-level detail (one vendor).',
    solution:
      'Introduce a Light interface. LightSwitch receives Light via constructor injection. LivingRoom can wire a PhilipsBulb today and an LedStrip tomorrow without touching the switch.',
    whenToUse: [
      'Core modules import concrete infrastructure classes directly',
      'Tests need heavy setup because constructors build real databases or APIs',
      'You swap implementations per environment (mock, staging, production)',
      'Examples: repositories, payment gateways, message brokers',
    ],
    whenNotToUse: [
      'A stable utility with no alternate implementation (e.g. String.format)',
      'You abstract before you have a second implementation — YAGNI',
    ],
    relatedPrinciples: ['open-closed', 'interface-segregation'],
    codeBefore: `// Switch hard-wired to Philips — swap brand, edit switch code
class PhilipsBulb {
    void illuminate() { System.out.println("Philips warm glow"); }
}
class LightSwitch {
    private PhilipsBulb bulb = new PhilipsBulb();
    void flip() { bulb.illuminate(); }
}`,
    codeAfter: `interface Light { void illuminate(); }
class PhilipsBulb implements Light {
    public void illuminate() { System.out.println("Philips warm glow"); }
}
class LedStrip implements Light {
    public void illuminate() { System.out.println("LED strip bright white"); }
}
class LightSwitch {
    private final Light light;
    LightSwitch(Light light) { this.light = light; }
    void flip() { light.illuminate(); }
}`,
    quiz: [
      {
        question: 'DIP says high-level modules should not depend on…',
        options: [
          'Other high-level modules',
          'Low-level details — depend on abstractions instead',
          'Interfaces',
          'Constructor injection',
        ],
        correctIndex: 1,
        explanation:
          'Both sides should depend on abstractions; details implement those abstractions.',
      },
      {
        question: 'new DatabaseConnection() inside a Service class is a DIP smell because…',
        options: [
          'Databases are slow',
          'The service is tied to one concrete storage detail',
          'Services should be static',
          'SQL is deprecated',
        ],
        correctIndex: 1,
        explanation:
          'Inject a repository interface so the service stays independent of the storage engine.',
      },
    ],
  },
];
