import { useState, useEffect } from 'react';
import { reviewAPI, gameAPI, statisticsAPI} from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell , PieChart, Pie, Legend} from 'recharts';
import './Statistics.css';

const PIE_COLORS = ['#ff00ff', '#00ff9d', '#00ffff', '#ff9900', '#9d00ff', '#444444'];
function Statistics({ userId, selectedGame, onBack }) {
    const [loading, setLoading] = useState(true);

    const [topGamesData, setTopGamesData] = useState([]);
    const [bestGamesData, setBestGamesData] = useState([]);
    const [largestDevData, setLargestDevData] = useState([]);
    const [largestUserData, setLargestUserData] = useState([]);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
        setLoading(true);

        //Load Top games
        const popular_response = await statisticsAPI.getPopularGames('Playing');
        const popularThree = popular_response.data
        .map(game => ({
          name: game.title,
          count: parseInt(game.numberowned, 10) 
        }));
        //console.log(popularThree)
        setTopGamesData(popularThree);
        
        //Load best reviewd games
        const best_response = await statisticsAPI.getBestGames('all');
        const bestThree = best_response.data
        .map(game => ({
          name: game.title,
          avg_rating: parseFloat(game.averagereview) 
        }));
        //console.log(bestThree)
        setBestGamesData(bestThree);

        //Load largest developers
        const dev_response = await statisticsAPI.getLargestDevelopers();
        const largestDevs = dev_response.data
        .map(game => ({
          name: game.developer,
          num_developed_games: parseFloat(game.numberdevelopedgames) 
        }));

        const top5 = largestDevs.slice(0, 5);

        const othersCount = largestDevs.slice(5).reduce((sum, item) => {
            return sum + parseInt(item.num_developed_games, 10);
        }, 0);
        
        const finalPieData = [
            ...top5.map(d => ({ //I hate js, this syntax...
                name: d.name, 
                value: parseInt(d.num_developed_games, 10) 
            })),
            { name: 'Other', value: othersCount }
        ];

        //console.log(finalPieData)
        setLargestDevData(finalPieData);

        //Load largest users
        const user_response = await statisticsAPI.getLargestUsers();
        const largestUsers = user_response.data
        .map(user => ({
          username: user.username,
          gamecount: parseInt(user.ownedgames, 10) 
        }));
        console.log(largestUsers)
        setLargestUserData(largestUsers);        

        } catch (error) {
        console.error('Error fetching games:', error);
        } finally {
        setLoading(false);
        }
    };



    if (loading) {
        return (
        <div className="loading">
            <div className="loader"></div>
        </div>
        );
    }

return (
        <div className="reviews">
            <div className="leaderboard-header">
                <h2>VG Tracker Leader Boards</h2>
                <p className="leaderboard-subtitle">Checkout Top Performers</p>
            </div>
            <div className="leaderboard-header card">
                <div className="stats-dashboard">

                    {/* Top plaid games */}
                    <div className="stats-row">
                        <div className="stats-quadrant">
                            <h2 className="stats-title">Top 3 Most Played Games</h2>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topGamesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <XAxis 
                                            dataKey="name" stroke="var(--text-white)" 
                                            interval={0} angle={-35} textAnchor="end" height={80}
                                            tick={{fill: 'var(--text-white)', fontSize: 12}}
                                        />
                                        <YAxis stroke="var(--text-white)" allowDecimals={false} />
                                        <Bar dataKey="count" fill="var(--neon-blue)" barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Rated  games*/}
                        <div className="stats-quadrant">
                            <h2 className="stats-title">Top Rated</h2>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bestGamesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <XAxis 
                                            dataKey="name" stroke="var(--text-white)" 
                                            interval={0} angle={-35} textAnchor="end" height={80}
                                            tick={{fill: 'var(--text-white)', fontSize: 12}}
                                        />
                                        <YAxis stroke="var(--text-white)" domain={[0, 5]} />
                                        <Bar dataKey="avg_rating" fill="var(--neon-pink)" barSize={50} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>



                    <div className="stats-row">
                        {/* Largest Users */}
                        <div className="stats-quadrant">
                            <h2 className="stats-title">Top Collectors</h2>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        layout="vertical" data={largestUserData} 
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis type="number" stroke="var(--text-white)" allowDecimals={false} />
                                        <YAxis 
                                            type="category" dataKey="username" stroke="var(--text-white)" 
                                            width={100} tick={{fill: 'var(--text-white)'}}
                                        />
                                        <Bar dataKey="gamecount" fill="var(--neon-cyan)" barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Developer Share */}
                        <div className="stats-quadrant">
                            <h2 className="stats-title">Developer Share</h2>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={largestDevData} cx="50%" cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100} dataKey="value"
                                        >
                                            {largestDevData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Statistics;
