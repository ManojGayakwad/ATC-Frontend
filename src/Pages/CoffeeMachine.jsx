import React, { useState, useEffect } from 'react';
import { Coffee, CreditCard, Droplet, Milk } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '../api/index';

const CoffeeMachine = () => {
    // State Management
    const [resources, setResources] = useState({
        water: { amount: 0, unit: "ml" },
        milk: { amount: 0, unit: "ml" },
        coffee: { amount: 0, unit: "g" },
        tea: { amount: 0, unit: "g" },
    });
    const [beverages, setBeverages] = useState([]);
    const [profit, setProfit] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [coins, setCoins] = useState({
        tenRupee: 0,
        fiveRupee: 0,
        twoRupee: 0,
        oneRupee: 0,
    });
    const [orderStatus, setOrderStatus] = useState(""); // Track order status

    const fetchData = async () => {
        try {
            const [beveragesRes, resourcesRes] = await Promise.all([
                api.getBeverages(),
                api.getResources(),
            ]);

            const resourcesObj = resourcesRes.data.reduce((acc, resource) => {
                acc[resource.name] = {
                    id: resource._id,
                    amount: resource.amount || 0,
                    unit: resource.unit || "",
                    threshold: resource.threshold || 0,
                };
                return acc;
            }, {});

            setBeverages(beveragesRes.data || []);
            setResources(resourcesObj);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculateTotal = () =>
        coins.tenRupee * 10 +
        coins.fiveRupee * 5 +
        coins.twoRupee * 2 +
        coins.oneRupee * 1;

    const handleCoinChange = (coinType, value) => {
        setCoins((prev) => ({
            ...prev,
            [coinType]: Math.max(0, parseInt(value) || 0),
        }));
    };

    const isResourceSufficient = (orderIngredients) => {
        for (const item in orderIngredients) {
            const requiredAmount = orderIngredients[item];
            const resourceKey = Object.keys(resources).find(
                (key) => key.toLowerCase() === item.toLowerCase()
            );

            if (!resourceKey || requiredAmount > resources[resourceKey].amount) {
                setMessage(`Sorry, पर्याप्त ${item} नहीं है। (Not enough ${item})`);
                return false;
            }
        }
        return true;
    };

    const processTransaction = (drinkCost) => {
        const moneyReceived = calculateTotal();
        if (moneyReceived >= drinkCost) {
            const change = moneyReceived - drinkCost;
            setProfit((prev) => prev + drinkCost);
            setMessage(`धन्यवाद! आपका बदला ₹${change} (Your change: ₹${change})`);
            setCoins({ tenRupee: 0, fiveRupee: 0, twoRupee: 0, oneRupee: 0 });
            return true;
        } else {
            setMessage('क्षमा करें, राशि अपर्याप्त है। (Insufficient amount)');
            return false;
        }
    };

    const makeBeverage = async (beverage) => {
        if (!isResourceSufficient(beverage.ingredients)) return;
        if (!processTransaction(beverage.cost)) return;

        try {
            const orderData = {
                beverageId: beverage._id,
                amount: beverage.cost,
                paymentMethod: "cash",
            };

            const orderRes = await api.createOrder(orderData);
            const orderId = orderRes.data._id; // Assuming the API response includes the order ID
            setOrderStatus("pending"); // Initially set status to pending

            setTimeout(async () => {
                // Simulate status update to completed
                try {
                    await api.updateOrderStatus(orderId, { status: "completed" });
                    setOrderStatus("completed");
                    setMessage(`यह रहा आपका ${beverage.name} ☕️। आनंद लीजिए!`);
                    fetchData();
                } catch (err) {
                    console.error("Failed to update order status:", err);
                    setMessage("Order completed, but status update failed.");
                }
            }, 3000);
        } catch (err) {
            console.error("Error creating order:", err);
            setMessage("Failed to process order");
        }
    };

    const ResourceDisplay = ({ icon, label, value, unit }) => (
        <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{label}:</span>
            <span>
                {value || 0} {unit}
            </span>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>चाय/कॉफी मशीन (Tea/Coffee Machine)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Resources Display */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {Object.keys(resources).map((key) => (
                            <ResourceDisplay
                                key={resources[key].id}
                                icon={<Droplet className="w-4 h-4" />}
                                label={key === 'Water' ? 'पानी (Water)' : key === 'Milk' ? 'दूध (Milk)' : key === 'Coffee' ? 'कॉफी (Coffee)' : 'चाय (Tea)'}
                                value={resources[key].amount || 0}
                                unit={resources[key].unit}
                            />
                        ))}
                        {/* <ResourceDisplay
                            icon={<Milk className="w-4 h-4" />}
                            label="दूध (Milk)"
                            value={resources.milk?.amount}
                            unit={resources.milk?.unit}
                        />
                        <ResourceDisplay
                            icon={<Coffee className="w-4 h-4" />}
                            label="कॉफी (Coffee)"
                            value={resources.coffee?.amount}
                            unit={resources.coffee?.unit}
                        /> */}

                        <ResourceDisplay

                            icon={<CreditCard className="w-4 h-4" />}
                            label="कमाई (Profit)"
                            value={`₹${profit}`}
                            unit=""
                        />

                    </div>

                    {/* Beverage Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        {beverages.map((beverage) => (
                            <button
                                key={beverage._id}
                                onClick={() => makeBeverage(beverage)}
                                className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                disabled={!beverage.available}
                            >
                                {beverage.name}
                                <div className="text-sm">₹{beverage.cost}</div>
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {Object.entries(coins).map(([coinType, value]) => (
                            <div key={coinType} className="flex items-center gap-2">
                                <label className="min-w-32">
                                    {coinType === 'tenRupee' ? '₹10 Coins' :
                                        coinType === 'fiveRupee' ? '₹5 Coins' :
                                            coinType === 'twoRupee' ? '₹2 Coins' :
                                                '₹1 Coins'}:
                                </label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleCoinChange(coinType, e.target.value)}
                                    className="border rounded p-2 w-20"
                                    min="0"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Total Display */}
                    <div className="text-right font-bold">
                        कुल राशि (Total): ₹{calculateTotal()}
                    </div>

                    {/* Message Display */}
                    {message && (
                        <Alert className="mt-4 font-medium" variant="info">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CoffeeMachine;