import { useGame } from '../contexts/GameContext';

export default function Players() {
  const { allPlayers } = useGame();
  
  const sortedPlayers = [...allPlayers].sort((a, b) => b.rating - a.rating);

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="p-4 w-[20%] whitespace-nowrap">Player</th>
              <th className="p-4 w-[10%] whitespace-nowrap">Position</th>
              <th className="p-4 w-[20%] whitespace-nowrap">Country</th>
              <th className="p-4 w-[20%] whitespace-nowrap">Team</th>
              <th className="p-4 w-[15%] whitespace-nowrap">Seasons</th>
              <th className="p-4 w-[15%] whitespace-nowrap">Rating</th>
            </tr>
          </thead>
          <tbody className="border-b-2 border-black">
            {sortedPlayers.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="p-4 w-[20%]">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={`/images/players/${player.permalink}.png`}
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover object-[center_top]"
                    />
                    <span className="truncate">{player.name}</span>
                  </div>
                </td>
                <td className="p-4 w-[10%] text-center">{player.position}</td>
                <td className="p-4 w-[20%]">
                  <div className="flex items-center justify-center">
                    <img 
                      src={`/images/countries/${player.nationality.toLowerCase().replace(' ', '-')}.svg`}
                      alt={player.nationality}
                      className="w-12 h-8 object-contain"
                    />
                  </div>
                </td>
                <td className="p-4 w-[20%]">
                  <div className="flex items-center justify-center">
                    <img 
                      src={`/images/teams/${player.team.toLowerCase()}.svg`}
                      alt={player.team}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </td>
                <td className="p-4 w-[15%] text-center">{player.seasons}</td>
                <td className="p-4 w-[15%] text-center">{player.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}