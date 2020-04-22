package chess.domain.piece.pathStrategy;

import static chess.util.NullValidator.*;

import chess.domain.board.Position;
import chess.exception.NotMovableException;

public class QueenPathStrategy extends LongRangePieceStrategy {

	@Override
	public void validateDistance(Position sourcePosition, Position targetPosition) {
		validateNull(sourcePosition, targetPosition);

		if (sourcePosition.isDifferentXPoint(targetPosition) && sourcePosition.isDifferentYPoint(targetPosition)
			&& sourcePosition.isNotSameXYGapWith(targetPosition)) {
			throw new NotMovableException(String.format("지정한 위치 %s는 퀸이 이동할 수 없는 곳입니다.", targetPosition.getName()));
		}
	}
}
