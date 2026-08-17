/**
 * Single source of truth for complete, runnable Java examples for all 5 SOLID principles.
 * Every codeBefore and codeAfter is a COMPLETE single-file Java program with
 * public class + main(). runDemo mirrors codeAfter.
 */
export interface PrincipleCode {
  codeBefore: string;
  codeAfter: string;
  runDemo: string;
}

function withDemo(codeBefore: string, codeAfter: string): PrincipleCode {
  return { codeBefore, codeAfter, runDemo: codeAfter };
}

export const principleCode: Record<string, PrincipleCode> = {
  'single-responsibility': withDemo(
    `// PROBLEM: one employee does waiter + chef + cashier.
// Menu change risks breaking billing — three jobs, one class.
class RestaurantEmployee {
    void takeOrder(String dish) {
        System.out.println("Order taken: " + dish);
    }
    void cook(String dish) {
        System.out.println("Cooking: " + dish);
    }
    void bill(double amount) {
        System.out.println("Bill total: $" + amount);
    }
}

public class SrpProblemDemo {
    public static void main(String[] args) {
        RestaurantEmployee bob = new RestaurantEmployee();
        bob.takeOrder("Margherita pizza");
        bob.cook("Margherita pizza");
        bob.bill(14.99);
        System.out.println("One person, three jobs — any change ripples everywhere.");
    }
}`,
    `// FIX: each role has exactly one reason to change.
class Waiter {
    void takeOrder(String dish) {
        System.out.println("Order taken: " + dish);
    }
}

class Chef {
    void cook(String dish) {
        System.out.println("Cooking: " + dish);
    }
}

class Cashier {
    void bill(double amount) {
        System.out.println("Bill total: $" + amount);
    }
}

public class SrpDemo {
    public static void main(String[] args) {
        String dish = "Margherita pizza";
        new Waiter().takeOrder(dish);
        new Chef().cook(dish);
        new Cashier().bill(14.99);
        System.out.println("Same meal — three focused classes.");
    }
}`,
  ),

  'open-closed': withDemo(
    `// PROBLEM: every new promo edits this one method.
class ShippingCalculator {
    double calculate(double subtotal, String promoCode) {
        if ("FLAT5".equals(promoCode)) {
            return 5.0;
        } else if ("FREE".equals(promoCode)) {
            return 0.0;
        } else if ("TENPCT".equals(promoCode)) {
            return subtotal * 0.10;
        }
        return subtotal * 0.08; // default
    }
}

public class OcpProblemDemo {
    public static void main(String[] args) {
        ShippingCalculator calc = new ShippingCalculator();
        double subtotal = 40.0;
        System.out.println("Flat promo:  $" + calc.calculate(subtotal, "FLAT5"));
        System.out.println("Free promo:  $" + calc.calculate(subtotal, "FREE"));
        System.out.println("Adding a 4th promo means editing calculate() again.");
    }
}`,
    `// FIX: open for extension (new rule classes), closed for modification.
interface ShippingRule {
    double fee(double subtotal);
    String label();
}

class FlatFiveRule implements ShippingRule {
    public double fee(double subtotal) { return 5.0; }
    public String label() { return "FLAT5"; }
}

class FreeShippingRule implements ShippingRule {
    public double fee(double subtotal) { return 0.0; }
    public String label() { return "FREE"; }
}

class TenPercentRule implements ShippingRule {
    public double fee(double subtotal) { return subtotal * 0.10; }
    public String label() { return "TENPCT"; }
}

class ShippingCalculator {
    double calculate(double subtotal, ShippingRule rule) {
        return rule.fee(subtotal);
    }
}

public class OcpDemo {
    public static void main(String[] args) {
        ShippingCalculator calc = new ShippingCalculator();
        double subtotal = 40.0;
        ShippingRule[] rules = { new FlatFiveRule(), new FreeShippingRule(), new TenPercentRule() };
        for (ShippingRule rule : rules) {
            System.out.println(rule.label() + " fee: $" + calc.calculate(subtotal, rule));
        }
        System.out.println("New promo = new ShippingRule class, calculator unchanged.");
    }
}`,
  ),

  'liskov-substitution': withDemo(
    `// PROBLEM: ElectricCar "is-a" GasCar but refuel() explodes.
class GasCar {
    void drive() { System.out.println("Gas car driving"); }
    void refuel() { System.out.println("Filling gas tank"); }
}

class ElectricCar extends GasCar {
    @Override
    void refuel() {
        throw new UnsupportedOperationException("Electric cars have no gas tank!");
    }
}

class RentalDesk {
    void prepareReturn(GasCar car) {
        car.drive();
        car.refuel(); // blows up for ElectricCar passed as GasCar
    }
}

public class LspProblemDemo {
    public static void main(String[] args) {
        RentalDesk desk = new RentalDesk();
        try {
            desk.prepareReturn(new ElectricCar());
        } catch (UnsupportedOperationException e) {
            System.out.println("Rental broke: " + e.getMessage());
        }
    }
}`,
    `// FIX: shared drive() on Vehicle; refuel() only on Refuelable gas cars.
interface Vehicle {
    void drive();
}

interface Refuelable {
    void refuel();
}

class GasCar implements Vehicle, Refuelable {
    public void drive() { System.out.println("Gas car driving"); }
    public void refuel() { System.out.println("Filling gas tank"); }
}

class ElectricCar implements Vehicle {
    public void drive() { System.out.println("Electric car driving"); }
}

class RentalDesk {
    void handOff(Vehicle vehicle) {
        vehicle.drive();
    }
    void prepareGasReturn(Refuelable car) {
        car.refuel();
    }
}

public class LspDemo {
    public static void main(String[] args) {
        RentalDesk desk = new RentalDesk();
        Vehicle electric = new ElectricCar();
        Vehicle gas = new GasCar();
        desk.handOff(electric);
        desk.handOff(gas);
        desk.prepareGasReturn((Refuelable) gas);
        System.out.println("Both vehicles drive; only gas cars refuel.");
    }
}`,
  ),

  'interface-segregation': withDemo(
    `// PROBLEM: phone forced to implement fax/print it will never support.
interface SmartDevice {
    void call(String number);
    void print(String document);
    void fax(String document);
}

class SimplePhone implements SmartDevice {
    public void call(String number) {
        System.out.println("Calling " + number);
    }
    public void print(String document) {
        throw new UnsupportedOperationException("Phones cannot print");
    }
    public void fax(String document) {
        throw new UnsupportedOperationException("Phones cannot fax");
    }
}

public class IspProblemDemo {
    public static void main(String[] args) {
        SmartDevice phone = new SimplePhone();
        phone.call("555-0100");
        try {
            phone.fax("contract.pdf");
        } catch (UnsupportedOperationException e) {
            System.out.println("Fat interface forced: " + e.getMessage());
        }
    }
}`,
    `// FIX: skinny interfaces — implement only what the device actually does.
interface Callable {
    void call(String number);
}

interface Printable {
    void print(String document);
}

interface Faxable {
    void fax(String document);
}

class SimplePhone implements Callable {
    public void call(String number) {
        System.out.println("Calling " + number);
    }
}

class OfficeCopier implements Printable, Faxable {
    public void print(String document) {
        System.out.println("Printing " + document);
    }
    public void fax(String document) {
        System.out.println("Faxing " + document);
    }
}

public class IspDemo {
    public static void main(String[] args) {
        Callable phone = new SimplePhone();
        phone.call("555-0100");

        OfficeCopier copier = new OfficeCopier();
        copier.print("contract.pdf");
        copier.fax("signed-contract.pdf");
        System.out.println("No stub methods — each device exposes only real capabilities.");
    }
}`,
  ),

  'dependency-inversion': withDemo(
    `// PROBLEM: switch hard-wired to Philips — swap brand, edit switch.
class PhilipsBulb {
    void illuminate() {
        System.out.println("Philips warm glow");
    }
}

class LightSwitch {
    private PhilipsBulb bulb = new PhilipsBulb();

    void flip() {
        bulb.illuminate();
    }
}

public class DipProblemDemo {
    public static void main(String[] args) {
        new LightSwitch().flip();
        System.out.println("Switch is locked to PhilipsBulb inside the class.");
    }
}`,
    `// FIX: switch depends on Light abstraction; bulb injected at setup.
interface Light {
    void illuminate();
}

class PhilipsBulb implements Light {
    public void illuminate() {
        System.out.println("Philips warm glow");
    }
}

class LedStrip implements Light {
    public void illuminate() {
        System.out.println("LED strip bright white");
    }
}

class LightSwitch {
    private final Light light;

    LightSwitch(Light light) {
        this.light = light;
    }

    void flip() {
        light.illuminate();
    }
}

public class DipDemo {
    public static void main(String[] args) {
        System.out.println("--- Philips setup ---");
        new LightSwitch(new PhilipsBulb()).flip();

        System.out.println("--- LED setup (same switch class) ---");
        new LightSwitch(new LedStrip()).flip();
        System.out.println("High-level switch never changed — only the injected Light.");
    }
}`,
  ),
};

/** @deprecated */
export const patternCode = principleCode;
export type PatternCode = PrincipleCode;
